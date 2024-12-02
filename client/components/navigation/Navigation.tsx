import { useAuthContext } from '@/contexts/authContext';
import { logout } from '@/services/auth/auth.service';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UserProfileIcon } from '@/utils/svgIcons';

const CaretIcon = () => (
	<svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M3.71716 3.71716C3.87337 3.87337 4.12663 3.87337 4.28284 3.71716L7.31716 0.682842C7.56914 0.430856 7.39068 0 7.03431 0H0.965685C0.609323 0 0.430857 0.430857 0.682843 0.682843L3.71716 3.71716Z"
			fill="white"
		/>
	</svg>
);

const useClickOutside = (ref: React.RefObject<HTMLElement>, onClickOutside: () => void) => {
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClickOutside();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [ref, onClickOutside]);
};

const MenuDropdownItem = ({ href, imgSrc, title, description }: { href: string; imgSrc: string; title: string; description: string }) => (
	<a className="flex items-center space-x-3 p-3 hover:bg-gray-700 transition duration-200 rounded-md" href={href}>
		<Image alt={title} width={56} height={56} className="rounded-md shadow-md" src={imgSrc} />
		<div>
			<div className="font-semibold text-white">{title}</div>
			<div className="text-gray-400 text-xs">{description}</div>
		</div>
	</a>
);

interface UserDropdownProps {
	setUser: (user: null) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ setUser }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useClickOutside(dropdownRef, () => setIsOpen(false));

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition duration-200"
				onClick={() => setIsOpen(!isOpen)}
			>
				<UserProfileIcon className="h-8 w-8" />
				<span className="text-sm font-semibold text-white">Player Name</span>
				<CaretIcon />
			</button>
			{isOpen && (
				<div className="absolute right-0 bg-gray-800 p-4 rounded-lg mt-2 w-48 shadow-lg border border-gray-700">
					<a href="/profile" className="block text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200">
						Profile
					</a>
					<a href="/settings" className="block text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200">
						Settings
					</a>
					<button
						onClick={async () => {
							logout(setUser);
						}}
						className="block w-full text-left text-white py-2 px-3 rounded-lg hover:bg-red-600 transition duration-200"
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
};

const Dropdown = ({ title, children }: { title: string; children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useClickOutside(dropdownRef, () => setIsOpen(false));

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				className="text-white font-semibold flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg transition duration-200"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{title}</span>
				<CaretIcon />
			</button>
			{isOpen && (
				<div className="absolute left-0 bg-gray-800 p-4 rounded-lg mt-2 w-56 shadow-lg border border-gray-700">
					{children}
				</div>
			)}
		</div>
	);
};

const Navigation: React.FC = () => {
	const { user, setUser } = useAuthContext();

	return (
		<header className="bg-gray-900 text-white shadow-lg p-4">
			<div className="flex items-center justify-between w-full">
				{/* Logo */}
				<div className="flex items-center space-x-3">
					<a href="/" className="flex items-center">
						{/* <Image alt="GeoGuessr" src="/_next/static/media/logo.6958f2fb.svg" width={208} height={40} /> */}
						<h1 className="text-xl font-bold ml-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
							REALorNOT
						</h1>
					</a>
				</div>

				{/* Menu items */}
				<div className="flex space-x-6 items-center">
					{/* Singleplayer Dropdown */}
					<Dropdown title="Singleplayer">
						<MenuDropdownItem
							href="/maps"
							imgSrc="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fglobetrotter.ed78fa40.webp&amp;w=128&amp;q=75"
							title="Campaign"
							description="Travel around the world and discover new places!"
						/>
					</Dropdown>

					{/* Multiplayer Dropdown */}
					<Dropdown title="Multiplayer">
						<div className="mb-4">
							<MenuDropdownItem
								href="/multyplayer/duels"
								imgSrc="/10179972.png"
								title="Duels"
								description="Compete with opponents in global duels."
							/>
							<MenuDropdownItem
								href="/multyplayer/tournaments"
								imgSrc="/first-place-trophy.png"
								title="Tournaments"
								description="Participate in ranked tournaments."
							/>
							<MenuDropdownItem
								href="/multyplayer/custon"
								imgSrc="/customize.png"
								title="Custom Games"
								description="Create and join custom game modes."
							/>

						</div>
					</Dropdown>

					{/* Party Dropdown */}
					<Dropdown title="Party">
						<MenuDropdownItem
							href="/party"
							imgSrc="/content-creator.png"
							title="Host a Party"
							description="Invite friends to play together!"
						/>
					</Dropdown>
				</div>

				{/* User Dropdown */}
				<UserDropdown setUser={setUser} />
			</div>
		</header>
	);
};

export default Navigation;
