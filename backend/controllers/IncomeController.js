import User from '../models/UserModel.js';
import Income from '../models/IncomeModel.js';


export const getIncome = async (req, res) => {
    try {
        const name = req.name; //dari middleware
        const user = await User.findOne({ name: name });
        if (!user) {
            return res.status(404).json({ msg: "User tidak Ditemukan" });
        }

        const userId = user.id
        const income = await Income.find({ userId })

        if (!income) {
            return res.status(404).json({ msg: "Income tidak Ditemukan" });
        }

        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ msg: "Ada kesalahan Server" });
    }
}

export const getIncomeId = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);
        res.status(200).json(income);
    } catch (error) {
        res.status(404).json({ msg: "Income tidak ditemukan" });
    }
}

export const createIncome = async (req, res) => {
    try {
        const { title, amount, type, date, category, description } = req.body;
        const name = req.name; //dari middleware
        const user = await User.findOne({ name: name });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" })
        }

        if (!title, !amount, !date, !category, !description) {
            return res.status(400).json({ msg: "Fields Harus diisi" });
        }

        const income = new Income({
            title: title,
            amount: amount,
            type: type,
            date: date,
            category: category,
            description: description,
            userId: user._id
        });

        await income.save();
        res.status(201).json({ msg: "Berhasil!" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
}

export const editIncome = async (req, res) => {
    try {
        const { title, amount, type, date, category, description } = req.body;
        const name = req.name; //dari middleware
        const incomeId = req.params.id;

        // temukan user dari name yang ditentukan di middleware
        const user = await User.findOne({ name: name });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" })
        }
        // temukan income id
        const income = await Income.findById(incomeId);
        if (!income) {
            return res.status(404).json({ msg: "Income tidak ditemukan" })
        }

        // hanya user yang bisa mengakses data miliknya
        if (income.userId.toString() !== user._id.toString()) {
            return res.sendStatus(403);
        }

        // update income
        income.title = title;
        income.amount = amount;
        income.type = type;
        income.date = date;
        income.category = category;
        income.description = description;

        await income.save();
        res.status(200).json({ msg: "Berhasil Update!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
}

export const deleteIncome = async (req, res) => {
    try {
        await Income.deleteOne({ _id: req.params.id });
        res.status(200).json({ msg: "Berhasil Delete" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
}