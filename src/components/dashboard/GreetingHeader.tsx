import { useEffect, useState } from "react";

interface Props {
  employeeName: string;
}

function GreetingHeader({ employeeName }: Props) {

  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setDate(formattedDate);
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  return (
    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">

      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {getGreeting()}, {employeeName} 👋
        </h1>

        <p className="text-gray-500 mt-1">
          {date}
        </p>
      </div>

    </div>
  )
}

export default GreetingHeader;