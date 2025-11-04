import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { AppJwtModule } from "../jwt/jwt.module";
import { MailModule } from "../mail/mail.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AppJwtModule, MailModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}