import { JwtService } from '@nestjs/jwt';
import { config } from 'src/shared';

const bcrypt = require('bcrypt');
const saltRounds = 10;

// DTO
export interface JwtPayloadDto {
    sub: string;
    email: string;
}

// PASSWORD
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const compareToken = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

// JWT
export function generateAccessToken(jwtService: JwtService, payload: JwtPayloadDto): string {
    return jwtService.sign(
        payload,
        {
            secret: config.jwt.secret,
            expiresIn: config.jwt.expiresInAccess
        }
    );
}

export function generateRefreshToken(jwtService: JwtService, payload: JwtPayloadDto): string {
    return jwtService.sign(
        payload,
        {
            secret: config.jwt.refresh_secret,
            expiresIn: config.jwt.expiresInRefresh
        }
    );
}

export function generateTokens(jwtService: JwtService, payload: JwtPayloadDto): { accessToken: string, refreshToken: string } {
    const accessToken = generateAccessToken(jwtService, payload);
    const refreshToken = generateRefreshToken(jwtService, payload);

    return { accessToken, refreshToken };
}

export function verifyAccessToken(jwtService: JwtService, token: string): JwtPayloadDto {
    return jwtService.verify(token, { secret: config.jwt.secret });
}

export function verifyRefreshToken(jwtService: JwtService, token: string): JwtPayloadDto {
    return jwtService.verify(token, { secret: config.jwt.refresh_secret });
}
