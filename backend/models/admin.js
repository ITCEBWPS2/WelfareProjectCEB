const mongoose =  require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
    {
        epfNo:{
            type:Number,
            required:true,
        },
        username: {
            type: String,
            unique: true,
            required:true
        },
        password: {
            type: String,
            required: true
        },

        role:{
            type: String,
            required: true
        },
    },
    {timestamps: true }
);


//Compare passwords
adminSchema.methods.comparePassword = async function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



module.exports = mongoose.model("Admin", adminSchema);