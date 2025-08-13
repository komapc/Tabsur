import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DescriptionStep from '../DescriptionStep';

describe('DescriptionStep', () => {
  const mockUpdate = jest.fn();
  const mockForm = {
    description: 'Test description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    // Check for the heading text specifically
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Description');
    expect(screen.getByPlaceholderText('Describe the meal')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('displays the current description value', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    expect(textarea.value).toBe('Test description');
  });

  it('calls update function when text changes', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    // Simulate a real change event
    fireEvent.change(textarea, { target: { value: 'New description', id: 'description' } });
    
    // The update function should be called with the event target (DOM element)
    expect(mockUpdate).toHaveBeenCalledWith(textarea);
  });

  it('has correct Material-UI props', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    // Material-UI v7 uses rows as a prop, not attribute
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('has proper styling classes', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    // The wizard-description class is applied to the FormControl wrapper, not the textarea
    const formControl = screen.getByLabelText('Description').closest('.MuiFormControl-root');
    expect(formControl).toHaveClass('wizard-description');
  });

  it('handles empty description', () => {
    const emptyForm = { description: '' };
    render(<DescriptionStep update={mockUpdate} form={emptyForm} />);
    
    const textarea = screen.getByLabelText('Description');
    expect(textarea.value).toBe('');
  });

  it('updates description correctly', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    const newValue = 'Updated meal description';
    
    fireEvent.change(textarea, { target: { value: newValue, id: 'description' } });
    
    // The update function should be called with the DOM element
    expect(mockUpdate).toHaveBeenCalledWith(textarea);
  });

  it('maintains proper layout structure', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    // Check that the component has the expected structure
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Description');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has accessible label and placeholder', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('placeholder', 'Describe the meal');
    // Material-UI automatically creates the label association, no need for aria-label
  });

  it('renders with proper Grid and Box layout', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    // Check that Material-UI Grid and Box components are used
    const gridContainer = screen.getByLabelText('Description').closest('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();
  });

  it('has multiline textarea', () => {
    render(<DescriptionStep update={mockUpdate} form={mockForm} />);
    
    const textarea = screen.getByLabelText('Description');
    // Check that the textarea has the multiline class
    expect(textarea).toHaveClass('MuiInputBase-inputMultiline');
  });
});
