import Email from "./Email";

// components/dashboard/messages/MessageRow.jsx
const MessageRow = ({ message }) => {
  return (
    <tr className="bg-secondary/[0.03] hover:bg-secondary/10 transition-colors *:p-space-3 *:first:rounded-l-xl *:last:rounded-r-xl text-size-h6">
      <td
      >
        {message.name}
      </td>
      <td className="text-secondary font-semibold"><Email email={message.email}/></td>
      <td className="max-w-[320px] truncate">
        {message.message}
      </td>
      <td className="whitespace-nowrap">
        {new Date(message.time).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td>
        <div className="flex items-center justify-end gap-space-3">
          {!message.isRead && (
            <span className="size-[12px] rounded-full bg-green-500 shrink-0"></span>
          )}
          <button className="p-space-2 rounded-md bg-secondary/10 text-secondary">
            <i className="fi fi-rr-arrow-small-right"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MessageRow;
