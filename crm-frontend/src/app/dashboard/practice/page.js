'use client'

import { useState } from 'react';

export default function SimpleCheckbox() {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div>
            <label>
                <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                Agree to terms
            </label>
            <p>Status: {isChecked ? 'Checked ✓' : 'Unchecked ✗'}</p>
        </div>
    );
}