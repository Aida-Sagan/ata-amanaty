"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PaginationContextType {
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const PaginationProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPage, setCurrentPageState] = useState(1);

    useEffect(() => {
        const savedPage = localStorage.getItem("currentPage");
        if (savedPage) {
            setCurrentPageState(parseInt(savedPage, 10));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("currentPage", currentPage.toString());
    }, [currentPage]);

    const setCurrentPage = (page: number) => {
        setCurrentPageState(page);
    };

    return (
        <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </PaginationContext.Provider>
    );
};

export const usePagination = () => {
    const context = useContext(PaginationContext);
    if (!context) {
        throw new Error("usePagination must be used within a PaginationProvider");
    }
    return context;
};
