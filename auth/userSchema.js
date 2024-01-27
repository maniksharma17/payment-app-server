const z = require("zod")

const signupSchema = z.object({
    username: z.string().email().min(3, {message: "Username must be greater than 3 characters."}).max(30, {message: "Username must be less than 30 characters."}).trim().toLowerCase(),
    firstName: z.string().max(20, {message: "First name should be less than 20 characters."}),
    lastName: z.string().max(20, {message: "First name should be less than 20 characters."}),
    password: z.string().min(6, {message: "Password must be atleast 6 characters long."}),
    
})

const signinSchema = z.object({
    username: z.string().email().min(3, {message: "Username must be greater than 3 characters."}).max(30, {message: "Username must be less than 30 characters."}).trim().toLowerCase(),
    password: z.string().min(6, {message: "Password must be atleast 6 characters long."}),
    
})

const updateSchema = z.object({
    password: z.string().min(6, {message: "Password must be atleast 6 characters long."}).optional(),
    firstName: z.string().max(20, {message: "First name should be less than 20 characters."}).optional(),
    lastName: z.string().max(20, {message: "First name should be less than 20 characters."}).optional(),
})

module.exports = {
    signupSchema,
    signinSchema,
    updateSchema
}