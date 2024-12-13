import { model, MongooseError, Schema } from "mongoose";
import bcrypt from 'bcrypt'

type Tuser = Document & {
    username: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
}

const UserSchema = new Schema({ // schema är en klass?
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
},
{
    timestamps: true
})

// gör om password oläsligt 
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10) // krypterar flera gånger, extra säkert för pw om man t.ex har samma pw 
        this.password = hashedPassword

        next()
    } catch (error) { 
        if (error instanceof MongooseError) { // skicka vidare error till auth.ts ?
            next(error)
        }
        throw error
    }
})

// model lite som en tabell-ish (post, user etc)
export const User = model<Tuser>('User', UserSchema)