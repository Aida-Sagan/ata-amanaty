"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ru from "@/locales/ru.json";
import kz from "@/locales/kz.json";

const translations = { ru, kz };

type Lang = "ru" | "kz";
type TranslationKey = keyof typeof ru;

interface LanguageContextType {
    language: Lang;
    changeLanguage: (lang: Lang) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Lang>("ru");

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang === "kz" || savedLang === "ru") {
            setLanguage(savedLang);
        }
    }, []);

    const changeLanguage = (lang: Lang) => {
        setLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    const t = (key: TranslationKey) => {
        const value = translations[language][key];
        if (typeof value === "string") return value;
        console.warn(`Translation key "${key}" is an object, not a string`);
        return "";
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
