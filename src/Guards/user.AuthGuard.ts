
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

interface AuthenticatedUser {
    id: string;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request =
            context.switchToHttp().getRequest<AuthenticatedRequest>();

        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException(
                'Authorization token is required',
            );
        }

        const token = authHeader.slice(7).trim();

        if (!token) {
            throw new UnauthorizedException('Token is required');
        }

        try {
            const auth = await this.userService.verifyUserToken(token);

            request.user = {
                id: auth.user._id.toString(),
                email: auth.user.email,
            };

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
