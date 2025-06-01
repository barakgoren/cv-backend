import { Request, Response } from 'express';
import User from '../models/User';
import { UserDTO } from '../dto/UserDTO';
import userValidationSchema, { userLoginValidationSchema } from '../schemas/user.schema';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';
import Logger from '../utils/logger';
import { MongoError } from 'mongodb';
import { NotFound, Success } from '../utils/errorHandler';

export const createUser = async (req: Request, res: Response) => {
    try {
        const parseResult = userValidationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).send(parseResult.error.errors);
        }
        const userDTO: UserDTO = parseResult.data;
        userDTO.password = await bcrypt.hash(userDTO.password, 10); // Hash password
        const user = new User(userDTO);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        if (error instanceof MongoError) {
            if (error.code === 11000) {
                // Duplicate key error
                const message = `Duplicate key error: ${Object.keys((error as any).keyValue)[0]} already exists`;
                Logger.error(message);
                return res.status(400).send(message);
            }
        }
        Logger.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const parseResult = userLoginValidationSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).send(parseResult.error.errors);
        }
        const { email, password } = parseResult.data;
        const user = await User.findOne({ email });
        if (!user) {
            return NotFound(res, { data: null, meta: { code: 404, title: 'Not Found', message: 'User not found' } });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }
        const token = generateToken(user._id);
        Success(res, token);
    } catch (error) {
        Logger.error('Error logging in: ', error);
        res.status(500).send("Error logging in");
    }
};

export const getUserByToken = async (req: Request, res: Response) => {
    try {
        const user = req.body.user;
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Error getting user");
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).send("ID is required");
        }
        const user = await User.findByUid(Number(req.params.id));
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(user);
    } catch (error) {
        Logger.error('Error getting user:', error);
        res.status(500).send("Error getting user");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        if (!req.params.id || isNaN(Number(req.params.id))) {
            return res.status(400).send("ID is required");
        }
        const user = await User.findByUid(Number(req.params.id));
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.softDelete();
        res.status(200).send("User deleted");
    } catch (error) {
        Logger.error('Error deleting user:', error);
        res.status(500).send("Error deleting user");
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};
