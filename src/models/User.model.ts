// backend/src/models/User.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';


// Definimos la interfaz para el documento de Usuario, extendiendo Document de Mongoose
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string; // Almacenaremos el hash de la contraseña, no la contraseña en texto plano
  createdAt: Date;
  updatedAt: Date;
  // Futuro: roles, prompts creados, etc.
  // Opcional: método para comparar contraseñas
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio.'],
      unique: true, // Asegura que no haya emails duplicados
      lowercase: true,
      trim: true,
      // validación de formato de email
      match: [/.+\@.+\..+/, 'Por favor, introduce un email válido.'],
    },
    passwordHash: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      // Opcional: seleccionar false para que no se devuelva por defecto en las queries
      select: false,
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
  }
);

// Opcional: Middleware pre-save para hashear la contraseña antes de guardar
// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('passwordHash')) { // Solo hashear si la contraseña ha cambiado o es nueva
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.passwordHash = await bcrypt.hash(this.passwordHash, salt); // Asumiendo que 'passwordHash' contenía la contraseña en texto plano temporalmente
//     return next();
//   } catch (err: any) { // Especificar 'any' o un tipo de error más específico
//     return next(err);
//   }
// });

//  Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
