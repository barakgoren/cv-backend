import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { Permission } from '../models/User';
import { BadRequest, Forbidden, NotFound, Unauthorized } from './errorHandler';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;
    if (!user.permissions.includes(Permission.Admin)) {
        return Forbidden(res, {
            message: 'You do not have permission to access this resource',
            data: null
        });
    }
    next();
};

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return BadRequest(res, {
            message: 'Token is required',
            data: null
        });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found. You must set it in your environment variables.');
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err: any, user: any) => {
        if (err) {
            return Unauthorized(res, {
                message: 'Invalid token',
                data: null
            });
        }
        const validUser = await User.findById(user._id);
        if (!validUser) {
            return NotFound(res, {
                message: 'User not found',
                data: null
            });
        }
        req.body.user = validUser;
        next();
    });
};

export const generateToken = (userId: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found');
    }
    return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};