import React from "react";

export default function NotificationPage() {
	// Example notifications
	const notifications = [
		{ id: 1, text: "50% OFF on all Nike products!", time: "2 hours ago" },
		{ id: 2, text: "Starbucks: Buy 1 Get 1 Free today only!", time: "4 hours ago" },
		{ id: 3, text: "New arrivals at VR Mall, Chennai.", time: "Yesterday" },
	];
	return (
		<div className="w-full max-w-sm mx-auto min-h-screen flex flex-col items-center bg-white pt-8">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
			{notifications.length === 0 ? (
				<div className="text-gray-500 text-center">No new notifications.</div>
			) : (
				<ul className="w-full px-4">
					{notifications.map(n => (
						<li key={n.id} className="mb-4 p-4 bg-gray-50 rounded shadow flex flex-col">
							<span className="text-gray-700">{n.text}</span>
							<span className="text-xs text-gray-400 mt-1">{n.time}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
