import { SvgProps } from "./interfaces";

export function UserProfileIcon(props: SvgProps) {
	return (
		<svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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



export function Pin(props: SvgProps) {
	return (
		<svg
			{...props}
			viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.9511 8.59515L12.5875 8.23781C11.069 6.7455 10.3098 5.99934 9.48673 6C9.21786 6.00021 8.95184 6.05411 8.70481 6.15843C7.94859 6.47775 7.55155 7.45818 6.75747 9.41903L6.70001 9.56094C6.47489 10.1168 6.36233 10.3948 6.18157 10.619C6.04444 10.7891 5.87938 10.9356 5.6932 11.0523C5.44779 11.2061 5.15496 11.2878 4.5693 11.4511C3.66115 11.7045 3.20707 11.8311 3.00555 12.1012C2.8558 12.302 2.7898 12.5514 2.82108 12.7984C2.86316 13.1307 3.19693 13.4588 3.86446 14.1148L4.88148 15.1143L5.92632 16.1412L5.94409 16.1586L6.97115 17.168C7.63868 17.8241 7.97244 18.1521 8.31063 18.1934C8.56197 18.2242 8.81575 18.1593 9.02 18.0121C9.29483 17.8141 9.42371 17.3678 9.68146 16.4753C9.84768 15.8997 9.9308 15.6119 10.0873 15.3708C10.2061 15.1878 10.3551 15.0256 10.5282 14.8908C10.7563 14.7132 11.0391 14.6025 11.6048 14.3813L11.7492 14.3248C13.7444 13.5444 14.742 13.1542 15.0669 12.411C15.173 12.1682 15.2279 11.9068 15.2281 11.6425C15.2287 10.8336 14.4695 10.0875 12.9511 8.59515Z" fill="#613583"></path> <path opacity="0.5" d="M3.2706 18.7857L5.94386 16.1586L5.92608 16.1411L4.88125 15.1143L2.218 17.7512C1.92733 18.0369 1.92733 18.5 2.218 18.7857C2.50867 19.0714 2.97993 19.0714 3.2706 18.7857Z" fill="#613583"></path> <g opacity="0.5"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0003 8.37699C22.0003 8.78098 21.667 9.10848 21.256 9.10848H16.294C15.8829 9.10848 15.5497 8.78098 15.5497 8.37699C15.5497 7.97301 15.8829 7.64551 16.294 7.64551H21.256C21.667 7.64551 22.0003 7.97301 22.0003 8.37699Z" fill="#613583"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0003 12.7659C22.0003 13.1699 21.667 13.4974 21.256 13.4974H17.2864C16.8753 13.4974 16.5421 13.1699 16.5421 12.7659C16.5421 12.3619 16.8753 12.0344 17.2864 12.0344H21.256C21.667 12.0344 22.0003 12.3619 22.0003 12.7659Z" fill="#613583"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.0003 17.1548C22.0003 17.5588 21.667 17.8863 21.256 17.8863H12.3244C11.9133 17.8863 11.5801 17.5588 11.5801 17.1548C11.5801 16.7508 11.9133 16.4234 12.3244 16.4234H21.256C21.667 16.4234 22.0003 16.7508 22.0003 17.1548Z" fill="#613583"></path> </g> </g></svg>
	)
}
