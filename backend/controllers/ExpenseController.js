import User from '../models/UserModel.js';
import Expense from '../models/ExpenseModel.js';


export const getExpense = async (req, res) => {
    try {
        const name = req.name; //dari middleware
        const user = await User.findOne({ name: name });
        if (!user) {
            return res.status(404).json({ msg: "User tidak Ditemukan" });
        }

        const userId = user.id
        const expense = await Expense.find({ userId })

        if (!expense) {
            return res.status(404).json({ msg: "Expense tidak Ditemukan" });
        }

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ msg: "Ada kesalahan Server" });
    }
}

export const getExpenseId = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.status(200).json(expense);
    } catch (error) {
        res.status(404).json({ msg: "Expense tidak ditemukan" });
    }
}

export const createExpense = async (req, res) => {
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

        const expense = new Expense({
            title: title,
            amount: amount,
            type: type,
            date: date,
            category: category,
            description: description,
            userId: user._id
        });

        await expense.save();
        res.status(201).json({ msg: "Berhasil!" });
    } catch (error) {
        res.status(500).json({ msg: "Server Error" });
    }
}

export const editExpense = async (req, res) => {
    try {
        const { title, amount, type, date, category, description } = req.body;
        const name = req.name; //dari middleware
        const expenseId = req.params.id;

        // temukan user dari name yang ditentukan di middleware
        const user = await User.findOne({ name: name });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" })
        }
        // temukan Expense id
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ msg: "Expense tidak ditemukan" })
        }

        // hanya user yang bisa mengakses data miliknya
        if (expense.userId.toString() !== user._id.toString()) {
            return res.sendStatus(403);
        }

        // update Expense
        expense.title = title;
        expense.amount = amount;
        expense.type = type;
        expense.date = date;
        expense.category = category;
        expense.description = description;

        await expense.save();
        res.status(200).json({ msg: "Berhasil Update!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
}

export const deleteExpense = async (req, res) => {
    try {
        await Expense.deleteOne({ _id: req.params.id });
        res.status(200).json({ msg: "Berhasil Delete" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
}