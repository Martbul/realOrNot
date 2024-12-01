import { SvgProps } from "./interfaces";

export function UserProfileIcon(props: SvgProps) {
	return (
		<svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
	)
}


export function AnimatedCircleIcon(props: SvgProps) {
	return (
		<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
			<radialGradient
				id="a9"
				cx=".66"
				fx=".66"
				cy=".3125"
				fy=".3125"
				gradientTransform="scale(1.5)"
			>
				<stop offset="0" stopColor="#FFFFFF"></stop>
				<stop offset=".3" stopColor="#FFFFFF" stopOpacity=".9"></stop>
				<stop offset=".6" stopColor="#FFFFFF" stopOpacity=".6"></stop>
				<stop offset=".8" stopColor="#FFFFFF" stopOpacity=".3"></stop>
				<stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
			</radialGradient>
			<circle
				// transformOrigin="center"
				fill="none"
				stroke="url(#a9)"
				strokeWidth="10"
				strokeLinecap="round"
				strokeDasharray="200 1000"
				strokeDashoffset="0"
				cx="100"
				cy="100"
				r="70"
			>
				<animateTransform
					type="rotate"
					attributeName="transform"
					calcMode="spline"
					dur="2s"
					values="360;0"
					keyTimes="0;1"
					keySplines="0 0 1 1"
					repeatCount="indefinite"
				></animateTransform>
			</circle>
			<circle
				// transformOrigin="center"
				fill="none"
				opacity=".2"
				stroke="#FFFFFF"
				strokeWidth="10"
				strokeLinecap="round"
				cx="100"
				cy="100"
				r="70"
			></circle>
		</svg>
	);
}

export function GithubIcon(props: SvgProps) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</svg>
	);
}

export function ChromeIcon(props: SvgProps) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="4" />
			<line x1="21.17" x2="12" y1="8" y2="8" />
			<line x1="3.95" x2="8.54" y1="6.06" y2="14" />
			<line x1="10.88" x2="15.46" y1="21.94" y2="14" />
		</svg>
	);
}
