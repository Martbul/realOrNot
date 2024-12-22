"use client"
// components/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		// Update state to show fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log the error to an external service if needed
		console.error("Error caught in ErrorBoundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div style={{ textAlign: 'center', padding: '2rem' }}>
					<h1>Something went wrong.</h1>
					<p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
