import mongoose, { InferSchemaType, model, Schema } from "mongoose";

const NoteSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof NoteSchema>;

export default model<Note>("Note", NoteSchema);
