import React, { ReactNode } from 'react'

const LoanLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <h1>
                Loan Page Layout
            </h1>
            {children}
        </div>
    )
}

export default LoanLayout