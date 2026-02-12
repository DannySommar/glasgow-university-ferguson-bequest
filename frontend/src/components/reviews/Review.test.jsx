import { vi, test, beforeEach, describe, expect, afterEach} from 'vitest';
import { render, screen, fireEvent, cleanup} from '@testing-library/react';
//import { MemoryRouter } from 'react-router-dom';
import ReviewForm from './ReviewForm.jsx';


describe('ReviewForm', () => {
    const mockOnAddReview = vi.fn();

    beforeEach(() => {
        mockOnAddReview.mockClear();
        window.alert = vi.fn();
    })



afterEach(() => {
     cleanup();
     vi.clearAllMocks();
});

test('renders form elements', () =>{
    render (<ReviewForm attractionId={1} onAddReview={mockOnAddReview}/>);

    expect(screen.getByText('Write a Review!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your review...')).toBeInTheDocument();
    expect(screen.getByText('Submit Review')).toBeInTheDocument();
});


test('allows user to write a comment for review', () =>{
    render (<ReviewForm attractionId={1} onAddReview={mockOnAddReview}/>);

    const textarea = screen.getByPlaceholderText('Write your review...');

    fireEvent.change(textarea, {target: {value: 'Great place!'}});

    expect(textarea.value).toBe('Great place!');
});

test('allows user to select a rating', () =>{
    render (<ReviewForm attractionId={1} onAddReview={mockOnAddReview}/>);

    const stars = screen.getAllByText('★');

    fireEvent.click(stars[3]);

    expect(stars[3].className).toContain('filled');
});


test('show warning when rating not selected', () =>{
    render (<ReviewForm attractionId={1} onAddReview={mockOnAddReview}/>);

    const button = screen.getByText('Submit Review');

    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith('Please select a rating');
    expect(mockOnAddReview).not.toHaveBeenCalled();
});

test('successfully submit a review', () =>{
    render (<ReviewForm attractionId={3} onAddReview={mockOnAddReview}/>);

    const button = screen.getByText('Submit Review');
    const stars = screen.getAllByText('★');
    const textarea = screen.getByPlaceholderText('Write your review...');

    fireEvent.change(textarea, {target: {value: 'Amazing!'}});
    fireEvent.click(stars[4]);
    fireEvent.click(button);

    expect(mockOnAddReview).toHaveBeenCalledWith({
        attraction_id: 3,
        comment: 'Amazing!',
        rating: 5
    });
});
});






