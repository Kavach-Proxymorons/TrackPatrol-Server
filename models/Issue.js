import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
    issue_category: {
        type: String,
    },
    issue_description: {
        type: String,
    },
    issue_status: {
        type: String,
    },
    issue_creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personnel'
    }
}, { timestamps: true }
);

const Issue = mongoose.model('Issue', issueSchema);
export default Issue;

