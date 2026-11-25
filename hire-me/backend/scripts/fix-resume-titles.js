import mongoose from "mongoose";
import { User } from "../src/modules/users/user.model.js";
import { Resume } from "../src/modules/resumes/resume.model.js";
import { buildResumeTitle } from "../src/modules/resumes/resume.title.js";

await mongoose.connect(process.env.MONGODB_URI);

const users = await User.find().select("name").lean();
for (const u of users) {
  await Resume.updateMany(
    { user: u._id },
    { $set: { title: buildResumeTitle(u.name) } },
  );
}

await Resume.updateMany(
  { guestId: { $type: "string" } },
  { $set: { title: buildResumeTitle(null) } },
);

console.log("Done: resume titles updated");
await mongoose.disconnect();