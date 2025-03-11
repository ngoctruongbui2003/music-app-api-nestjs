import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyRefreshToken } from 'src/utils';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token không được để trống!');
        }

        try {
            const decoded = verifyRefreshToken(this.jwtService, refreshToken);
            req.user = { id: decoded.sub };
            return true;
        } catch (error) {
            throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn!');
        }
    }
}
