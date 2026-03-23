import { expect, vi, test, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../pages/Login.jsx';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return { ...actual, useNavigate: () => mockNavigate };
    });

vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({ login: vi.fn(), logout: vi.fn(), user: null})
}));

const renderLogin = () => 
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn();
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

test('shows error when API fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Invalid Credentials' }) });
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'u' }});
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'p' }});
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    await waitFor(() => screen.getByText('Invalid Credentials'));   
});

test('navigates on success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ user: {} }) });
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'u'} });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'p'} });
    fireEvent.click(screen.getByRole('button', { name: /Log in/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
});

