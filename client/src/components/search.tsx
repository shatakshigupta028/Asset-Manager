import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import API from "../lib/axios";

interface Suggestion {
  id: number;
  text: string;
  type: "asset" | "user" | "complaint" ;
}

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const saveRecent = (search: string) => {
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const fetchSuggestions = async (searchText: string) => {
    try {
      const res = await API.get(`/search?q=${searchText}`);
      setSuggestions(res.data); 
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowSuggestions(true);
    if (val.trim().length > 0) {
      fetchSuggestions(val.trim());
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (suggestion: Suggestion | string) => {
    const isTextOnly = typeof suggestion === "string";
    const text = isTextOnly ? suggestion : suggestion.text;

    saveRecent(text);
    setShowSuggestions(false);
    setQuery("");

    if (isTextOnly) {
      navigate(`/search?q=${encodeURIComponent(text)}`);
      return;
    }

    switch (suggestion.type) {
      case "asset":
        navigate(`/assets/${suggestion.id}`);
        break;
      case "user":
        navigate(`/users/${suggestion.id}`);
        break;
      case "complaint":
        navigate(`/complaints/${suggestion.id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 border px-3 rounded-md shadow-sm bg-white dark:bg-gray-900">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Search assets, users, complaints..."
          className="border-none focus:outline-none focus:ring-0 text-sm bg-transparent"
        />
      </div>

      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700">
          {query.length > 0 && suggestions.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {suggestions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {s.text}
                </li>
              ))}
            </ul>
          ) : query.length > 0 && suggestions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No matches</div>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              <div className="mb-1 font-semibold">Recent searches:</div>
              {recentSearches.length === 0 ? (
                <div className="text-gray-400">No recent searches</div>
              ) : (
                <ul>
                  {recentSearches.map((r, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSearch(r)}
                      className="cursor-pointer py-1 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
