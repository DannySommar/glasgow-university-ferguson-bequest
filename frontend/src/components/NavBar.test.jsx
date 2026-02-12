import { vi, test, beforeEach, describe, expect, afterEach} from 'vitest';
import { render, screen, fireEvent, cleanup} from '@testing-library/react';
import {Navbar} from './Navbar.jsx';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext.jsx";

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockLogout = vi.fn();
vi.mock('../contexts/AuthContext.jsx', () => ({
    useAuth: () => ({
        user: null,
        logout: mockLogout,
    }),
}));


describe('Navbar', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockLogout.mockClear();
    });


    test('shows all the nav bar items when user is logged out', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Attractions')).toBeInTheDocument();
        expect(screen.getByText('Ticket Draws')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.queryByText('Log Out')).toBeNull();
        expect(screen.queryByText('My Bookings')).toBeNull();
        expect(screen.queryByText('Admin')).toBeNull();
    });


    test('shows My Bookings and Logout when user is logged in', () => {
        vi.mocked(require('../contexts/AuthContext.jsx').useAuth).mockReturnValue({
            user: { isAdmin: false },
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('My Bookings')).toBeInTheDocument();
        expect(screen.getByText('Log Out')).toBeInTheDocument();
        expect(screen.queryByText('Admin')).toBeNull();
        expect(screen.queryByText('Log In')).toBeNull();
    });


    test('shows My Bookings and Logout when user is logged in', () => {
        vi.mocked(require('../contexts/AuthContext').useAuth).mockReturnValue({
            user: { isAdmin: true },
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('My Bookings')).toBeInTheDocument();
        expect(screen.getByText('Log Out')).toBeInTheDocument();
        expect(screen.queryByText('Admin')).toBeInTheDocument();
        expect(screen.queryByText('Log In')).toBeNull();
    });

    
});