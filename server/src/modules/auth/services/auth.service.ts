import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "../dto/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "../dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { JwtServiceCustom } from "src/modules/jwt/jwt.service";
import { MailService } from "src/modules/mail/mail.service";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private configService: ConfigService, private jwtService: JwtServiceCustom, private mailService: MailService ) {}

    async register(dto: RegisterDto) {
        const {name, email, password} = dto;
        const skipEmailVerification = this.configService.get<string>('SKIP_EMAIL_VERIFICATION') === "true";
        
        const existing = await this.userRepo.findOne({ where: { email } });
        if (existing) throw new ConflictException('Email already exists');

        const hashed = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({ email, name, password: hashed, isVerified: skipEmailVerification });
        await this.userRepo.save(user);
        const token = this.jwtService.sign({ id: user.id, email: user.email}, "48h");
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
        const verificationLink =  `${frontendUrl}/auth/verify-email?token=${token}`;
        await this.mailService.sendVerificationEmail(user.email, user.name, verificationLink);
        return { message: 'User registered successfully', user: { email: user.email, id: user.id } };
    }

    async login(dto: LoginDto) {
        const {email, password} = dto;
        const user = await this.userRepo.findOne({ where: { email }, select: ['id', 'email', 'password'] });
        if(!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException("Invalid Credentials");
        const token = this.jwtService.sign({ id: user.id, email: user.email}, "7d");
        return { user: { id: user.id, email: user.email }, token };     
    }

    async verifyEmail(token: string) {
        if(!token)
            throw new BadRequestException('please provide the token for verification')
        let payload: any;
        try {
            payload = this.jwtService.verify(token);
        } catch (error) {           
            throw new BadRequestException('Invalid or expired verification token');
        }
        const user = await this.userRepo.findOne({ where: { email: payload.email}});
        if(!user) throw new NotFoundException('user is no longer available in the system');
        if (user.isVerified)
            return { message: "user was already verified"}
        user.isVerified = true;
        this.userRepo.save(user);
        return { message: "user verified successfully"}
    }
}