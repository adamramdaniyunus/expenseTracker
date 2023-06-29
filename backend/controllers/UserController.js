import User from '../models/UserModel.js';

export const getUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    try {
        const user = await User.findOne({ refresh_token: refreshToken }).select('name email refresh_token');
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ msg: "User tidak munggkin" });
    }
}