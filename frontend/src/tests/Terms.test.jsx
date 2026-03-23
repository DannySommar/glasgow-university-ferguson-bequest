import { vi, test, beforeEach, describe, expect, afterEach} from 'vitest';
import { render, screen, fireEvent, cleanup, queryByText, getByText} from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from "../contexts/AuthContext.jsx";
import { PopUp } from '../components/PopUp.jsx';
import { SpecificAttraction } from '../pages/SpecificAttraction.jsx';


vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({slug:'edinburgh-zoo'})
    };
});

beforeEach(() => {
    global.fetch = vi.fn((url) => {
        if (url === '/api/attractions') {
            return Promise.resolve({
                json: () => Promise.resolve ({
                    attractions: [
                        {
                            id:1,
                            title: "Edinburgh Zoo",
                            description: "some info",
                            img: null,
                        }
                    ]
                })
            });
        }
        if (url.includes('/api/reviews')){
            return Promise.resolve({
                json: () => Promise.resolve({reviews: []})
            });
        }
        return Promise.reject(new Error("unknown endpoint"));
    });
});

    const renderPopUp = () => 
        render(
            <MemoryRouter>
                <PopUp />
            </MemoryRouter>
        );

    const mockAttraction = {
        attractionId:1,
        title: "Edinburgh Zoo",
        description: "some info",
        img: null,
    }

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        });

    describe("PopUp comment", () => {
        test('ensure popup renders properly', () =>{

        
        renderPopUp();
        expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
});

        test('link to terms and conditions page is in popup', () =>{
            renderPopUp();

            const link = screen.getByRole("link", {name: /terms and conditions/i});
            expect(link).toHaveAttribute("href", "/Terms");

        });

        

        test('shows up on the specific attraction page when you click book now', async () =>{

        

            render(
                <AuthProvider>
                <MemoryRouter>
                    <SpecificAttraction/>
                </MemoryRouter>
                </AuthProvider>
            );


            expect(await screen.findByText(/some info/i)).toBeInTheDocument();

            

            const button = screen.getByRole("button", {name: /book now/i});
            fireEvent.click(button);
            await screen.findByRole("button", {name: /i accept/i});
            expect(await screen.findByText(/terms & conditions/i)).toBeInTheDocument();

        });



    });

