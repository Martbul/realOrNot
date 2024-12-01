import React from 'react';

// SVG Icon component for the caret
const CaretIcon = () => (
	<svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M3.71716 3.71716C3.87337 3.87337 4.12663 3.87337 4.28284 3.71716L7.31716 0.682842C7.56914 0.430856 7.39068 0 7.03431 0H0.965685C0.609323 0 0.430857 0.430857 0.682843 0.682843L3.71716 3.71716Z" fill="white" />
	</svg>
);

// Player Progress Bar Component
const PlayerProgress = () => (
	<div className="flex items-center space-x-2">
		<img
			src="/_next/static/media/player-avatar.abcdef.svg" // Replace with actual avatar path
			alt="Player Avatar"
			className="w-10 h-10 rounded-full border-2 border-white"
		/>
		<div className="text-white">
			<div className="text-xs font-semibold">Level 8</div>
			<div className="relative w-24 h-2 bg-gray-600 rounded-full">
				<div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
			</div>
		</div>
	</div>
);

// Dropdown Item Component
const MenuDropdownItem = ({ href, imgSrc, title, description }: { href: string, imgSrc: string, title: string, description: string }) => (
	<a className="flex items-center space-x-3 p-2 hover:bg-gray-700 transition duration-200 rounded-lg" href={href}>
		<img alt={title} loading="lazy" width="56" height="56" className="rounded-lg" src={imgSrc} />
		<div>
			<div className="font-semibold text-white">{title}</div>
			<div className="text-gray-400 text-sm">{description}</div>
		</div>
	</a>
);

// Main Header Component
const Navigation: React.FC = () => (
	<header className="bg-gray-900 text-white shadow-lg p-4">
		<div className="flex items-center justify-between w-full">
			{/* Left: Logo */}
			<div className="flex items-center space-x-3">
				<a href="/" className="flex items-center">
					<img alt="GeoGuessr" src="/_next/static/media/logo.6958f2fb.svg" width="208" height="40" />
					<h1 className="text-xl font-bold ml-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">GeoGuessr</h1>
				</a>
			</div>

			{/* Center: Menu Items */}
			<div className="flex space-x-6 items-center">
				{/* Singleplayer Dropdown */}
				<div className="relative group">
					<button className="text-white font-semibold flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg">
						<span>Singleplayer</span>
						<CaretIcon />
					</button>
					<div className="absolute left-0 hidden group-hover:block bg-gray-800 p-4 rounded-lg mt-2 w-48 shadow-lg">
						<MenuDropdownItem
							href="/maps"
							imgSrc="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fglobetrotter.ed78fa40.webp&amp;w=128&amp;q=75"
							title="Campaign"
							description="Travel around the world and discover new places!"
						/>
					</div>
				</div>

				{/* Multiplayer Dropdown */}
				<div className="relative group">
					<button className="text-white font-semibold flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg">
						<span>Multiplayer</span>
						<CaretIcon />
					</button>
					<div className="absolute left-0 hidden group-hover:block bg-gray-800 p-4 rounded-lg mt-2 w-64 shadow-lg">
						<MenuDropdownItem
							href="/multiplayer"
							imgSrc="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsolo-duels.38cea15c.webp&amp;w=128&amp;q=75"
							title="Duels"
							description="Compete with opponents in global duels."
						/>
					</div>
				</div>

				{/* Party Dropdown */}
				<div className="relative group">
					<button className="text-white font-semibold flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg">
						<span>Party</span>
						<CaretIcon />
					</button>
					<div className="absolute left-0 hidden group-hover:block bg-gray-800 p-4 rounded-lg mt-2 w-48 shadow-lg">
						<MenuDropdownItem
							href="/party"
							imgSrc="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhost-a-party.ddb36cda.webp&amp;w=128&amp;q=75"
							title="Host a Party"
							description="Invite friends to play together!"
						/>
					</div>
				</div>
			</div>

			{/* Right: Player Icon with Progress */}
			<PlayerProgress />
		</div>
	</header>
);

export default Navigation;
