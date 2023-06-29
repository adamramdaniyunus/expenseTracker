import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const Register = async (req, res) => {
    const { name, email, password, confpassword } = req.body;
    if (password !== confpassword) {
        return res.status(400).json({ msg: "Password tidak sesuai" });
    } const hashPasword = await argon2.hash(password);
    try {

        if (!name, !email, !password) {
            return res.status(400).json({ msg: "Fields Harus diisi" });
        }

        // periksa email apakah sudah terpakai
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(409).json({ msg: "User Already exist" });
        }

        // membuat user
        const user = new User({
            name: name,
            email: email,
            password: hashPasword
        });
        // simpan user ke database
        await user.save();
        res.status(201).json({ msg: "Berhasil Sign Up" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

export const Login = async (req, res) => {
    const { password, gmail } = req.body;
    if (!gmail, !password) {
        return res.status(400).json({ msg: "Fields Harus diisi" });
    }
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        const match = await argon2.verify(user.password, req.body.password);
        if (!match) {
            return res.status(404).json({ msg: 'Password salah' });
        }


        const userId = user.id;
        const email = user.email;
        const name = user.name;
        const accessToken = jwt.sign({ userId, name, email }, process.env.SECRET_TOKEN, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN, {
            expiresIn: "1d"
        });

        await User.updateOne({ _id: userId }, { refresh_token: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            // secure: false
        });

        res.header('Authorization', `Bearer${accessToken}`);
        res.json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server Error" });
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(204);
    }
    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) {
        return res.sendStatus(204);
    }
    const userId = user.id;
    await User.updateOne({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    res.clearCookie('jwtToken');
    return res.status(200).json({ msg: "Berhasil Logout" });
}