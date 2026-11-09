// components/dashboard/messages/MessagesTable.jsx
import MessageRow from "./MessageRow";

const MessagesTable = ({ messages }) => {
  return (
    <div className="rounded-2xl border-2 border-secondary/10 overflow-x-auto px-space-2">
      <table className="w-full text-left border-separate border-spacing-x-0 border-spacing-y-space-3">
        <thead>
          <tr className="text-[#CBD5F5] text-size-h6 *:font-medium *:border-b *:border-secondary/10 *:px-space-3 *:py-space-2">
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Time</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages?.map((message) => (
            <MessageRow key={message._id} message={message} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesTable;