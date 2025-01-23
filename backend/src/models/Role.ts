import { Schema, model, Document } from "mongoose";

interface IRole extends Document {
  value: string;
}

const RoleSchema = new Schema<IRole>({
  value: { type: String, unique: true, default: "USER" },
});

export default model<IRole>("Role", RoleSchema);
