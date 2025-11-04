import { Body, Controller, Get, HttpCode, Param, Post, Query, Res } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import express from "express";

@Controller('api/v1/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    registerUser(@Body() dto: RegisterDto) {
       return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(200)
    async loginUser(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
        const {token , user} = await this.authService.login(dto);
        res.cookie('token', token,  {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 *60 *1000,
            sameSite: "strict"
        })
      return { message: "Logged in successfully", user}
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
       return this.authService.verifyEmail(token);        
    }
}