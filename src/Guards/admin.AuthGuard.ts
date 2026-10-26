
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';

interface AuthenticatedAdmin {
    id: string;
    email: string;
    role: string;
}

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedAdmin;
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private readonly adminService: AdminService,
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
            const auth = await this.adminService.verifyAdminToken(token);
            request.user = {
                id: auth.admin._id.toString(),
                email: auth.admin.email,
                role: auth.admin.role
            };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
