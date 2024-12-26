import { useAuthContext } from '@/contexts/authContext';

import { logout } from '@/services/auth/auth.service';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Pin, UserProfileIcon } from '@/utils/svgIcons';
import Link from 'next/link';

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

const MenuDropdownItem = ({
	href,
	imgSrc,
	title,
	description,
}: {
	href: string;
	imgSrc: string;
	title: string;
	description: string;
}) => (
	<a
		className="flex items-center space-x-3 p-3 hover:bg-gray-700 transition duration-200 rounded-md"
		href={href}
	>
		<Image alt={title} width={56} height={56} className="rounded-md shadow-md" src={imgSrc} />
		<div>
			<div className="font-semibold text-white">{title}</div>
			<div className="text-gray-400 text-xs">{description}</div>
		</div>
	</a>
);

const UserDropdown = ({ setUser, user }) => {
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useClickOutside(dropdownRef, () => setUserDropdownOpen(false));

	return (
		<div className="relative hidden md:block" ref={dropdownRef}>
			<div
				className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition duration-200"
				onMouseEnter={() => setUserDropdownOpen(true)}
				onMouseLeave={() => setUserDropdownOpen(false)}
			>
				<UserProfileIcon className="h-8 w-8" />
				<span className="text-sm font-semibold text-white">{user.username}</span>
				<CaretIcon />
			</div>
			{userDropdownOpen && (
				<div className="absolute right-0 bg-gray-800 p-4 rounded-lg mt-2 w-48 shadow-lg border border-gray-700">
					<a href="/profile" className="block text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200">
						Profile
					</a>
					<a href="/settings" className="block text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition duration-200">
						Settings
					</a>
					<button
						onClick={async () => {
							await logout(setUser);
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
		<div
			className="relative"
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			ref={dropdownRef}
		>
			<button
				className="text-white font-semibold flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-lg transition duration-200"
				onClick={() => setIsOpen(!isOpen)} // For mobile toggle
			>
				<span>{title}</span>
				<CaretIcon />
			</button>
			{isOpen && (
				<div className="absolute left-0 bg-gray-800 p-4 rounded-lg mt-2 w-56 shadow-lg border border-gray-700 transition-all ease-in-out duration-200">
					{children}
				</div>
			)}
		</div>
	);
};

const Navigation: React.FC = () => {
	const { user, setUser } = useAuthContext();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);

	return (
		<header className="bg-gray-900 text-white shadow-lg p-4">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center space-x-3">
					<a href="/" className="flex items-center">
						<h1 className="text-xl font-bold ml-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
							REALorNOT
						</h1>
					</a>
				</div>

				<div className="hidden md:flex space-x-24 items-center">
					<Dropdown title="Singleplayer">
						<MenuDropdownItem
							href="/singleplayer/streak"
							imgSrc="/fire.png"

							title="Streak"
							description="Guess as long as you are right!"
						/>
						<MenuDropdownItem
							href="/singleplayer/pinpoint"
							imgSrc="/maps-and-flags.png"
							title="PinPoint"
							description="Guess what has been AI generated!"
						/>
					</Dropdown>

					<Dropdown title="Multiplayer">
						<MenuDropdownItem
							href="/multiplayer/duels"
							imgSrc="/10179972.png"
							title="Duels"
							description="Compete globally."
						/>
						<MenuDropdownItem
							href="/multiplayer/tournaments"
							imgSrc="/first-place-trophy.png"
							title="Tournaments"
							description="Join ranked tournaments."
						/>
						<MenuDropdownItem
							href="/multiplayer/custom"
							imgSrc="/customize.png"
							title="Custom Games"
							description="Create or join custom modes."
						/>
					</Dropdown>

					<Dropdown title="Party">
						<MenuDropdownItem
							href="/party"
							imgSrc="/content-creator.png"
							title="Host a Party"
							description="Play with friends."
						/>
					</Dropdown>
				</div>

				{user.username ? (
					<div className="hidden md:block">
						<UserDropdown setUser={setUser} user={user} />
					</div>
				) : (
					<Link href="/login">
						<button className="bg-indigo-950 text-white px-4 py-2 rounded">Login</button>
					</Link>
				)}

				<button
					className="md:hidden flex items-center text-white focus:outline-none"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label="Toggle menu"
				>
					{mobileMenuOpen ? (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
						</svg>
					)}
				</button>
			</div>

			{mobileMenuOpen && (
				<div className="mt-4 space-y-4 md:hidden">
					<div>
						<button
							onClick={() => setUserDropdownOpen(!userDropdownOpen)}
							className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg w-full text-left"
						>
							<UserProfileIcon className="h-10 w-10" />
							<div>
								<p className="text-white font-semibold">{user?.username || 'Player Name'}</p>
								<p className="text-gray-400 text-xs">{user?.email || 'player@example.com'}</p>
							</div>
							<CaretIcon />
						</button>

						{userDropdownOpen && (
							<div className="mt-2 bg-gray-800 rounded-lg shadow-md border border-gray-700">
								<a
									href="/profile"
									className="block text-white py-2 px-4 hover:bg-gray-700 transition duration-200"
								>
									Profile
								</a>
								<a
									href="/settings"
									className="block text-white py-2 px-4 hover:bg-gray-700 transition duration-200"
								>
									Settings
								</a>
								<button
									onClick={async () => {
										await logout(setUser);
									}}
									className="block w-full text-left text-white py-2 px-4 hover:bg-red-600 transition duration-200"
								>
									Logout
								</button>
							</div>
						)}
					</div>

					<div className="border-t border-gray-700 pt-4">
						<Dropdown title="Singleplayer">
							<MenuDropdownItem
								href="/singleplayer/streak"
								imgSrc="/fire.png"
								title="Streak"
								description="Guess as loong as you are right!"
							/>
							<MenuDropdownItem
								href="/singleplayer/pinpoint"
								imgSrc="/maps-and-flags.png"
								title="PinPoint"
								description="Guess what has been AI generated!"
							/>

						</Dropdown>
						<Dropdown title="Multiplayer">
							<MenuDropdownItem
								href="/multiplayer/duels"
								imgSrc="/10179972.png"
								title="Duels"
								description="Compete globally."
							/>
							<MenuDropdownItem
								href="/multiplayer/tournaments"
								imgSrc="/first-place-trophy.png"
								title="Tournaments"
								description="Join ranked tournaments."
							/>
							<MenuDropdownItem
								href="/multiplayer/custom"
								imgSrc="/customize.png"
								title="Custom Games"
								description="Create or join custom modes."
							/>
						</Dropdown>
						<Dropdown title="Party">
							<MenuDropdownItem
								href="/party"
								imgSrc="/content-creator.png"
								title="Host a Party"
								description="Play with friends."
							/>
						</Dropdown>
					</div>
				</div>
			)}
		</header>
	);
};

export default Navigation;
