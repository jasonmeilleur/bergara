import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSearchSuggestions, searchPath } from "../lib/search";

const inputClass =
  "w-full rounded-md bg-surface-raised py-1.5 pl-3 pr-9 text-sm text-ink ring-1 ring-border placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent";

interface SearchBoxProps {
  defaultQuery?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onSubmit?: () => void;
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}

export function SearchBox({
  defaultQuery = "",
  placeholder = "Search products…",
  className = "",
  inputClassName = "",
  autoFocus = false,
  onSubmit,
}: SearchBoxProps) {
  const inputId = useId();
  const listboxId = useId();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(defaultQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setQuery(defaultQuery);
    setDebouncedQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(
    () => getSearchSuggestions(debouncedQuery),
    [debouncedQuery],
  );

  const trimmed = query.trim();
  const showPanel = open && trimmed.length >= 2;
  const viewAllIndex = suggestions.length;
  const optionCount = suggestions.length + (suggestions.length > 0 ? 1 : 0);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery, suggestions.length]);

  useEffect(() => {
    if (!showPanel) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showPanel]);

  const closePanel = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const goToSearchResults = () => {
    navigate(searchPath(trimmed));
    closePanel();
    onSubmit?.();
  };

  const goToSuggestion = (href: string) => {
    navigate(href);
    closePanel();
    onSubmit?.();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (showPanel && activeIndex >= 0) {
      if (activeIndex === viewAllIndex) {
        goToSearchResults();
        return;
      }
      const suggestion = suggestions[activeIndex];
      if (suggestion) {
        goToSuggestion(suggestion.href);
        return;
      }
    }
    goToSearchResults();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel || optionCount === 0) {
      if (event.key === "Escape") closePanel();
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) =>
          index < optionCount - 1 ? index + 1 : 0,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) =>
          index > 0 ? index - 1 : optionCount - 1,
        );
        break;
      case "Escape":
        event.preventDefault();
        closePanel();
        break;
      case "Enter":
        if (activeIndex >= 0) {
          event.preventDefault();
          if (activeIndex === viewAllIndex) {
            goToSearchResults();
          } else {
            const suggestion = suggestions[activeIndex];
            if (suggestion) goToSuggestion(suggestion.href);
          }
        }
        break;
      default:
        break;
    }
  };

  const activeDescendant =
    activeIndex >= 0 && activeIndex < suggestions.length
      ? `${listboxId}-option-${activeIndex}`
      : activeIndex === viewAllIndex
        ? `${listboxId}-view-all`
        : undefined;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form role="search" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <input
          id={inputId}
          type="search"
          name="q"
          role="combobox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
          enterKeyHint="search"
          aria-expanded={showPanel && optionCount > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          className={`${inputClass} ${inputClassName}`}
        />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1 text-ink-muted hover:bg-surface-muted hover:text-ink"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      </form>

      {showPanel && optionCount > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full right-0 left-0 z-[60] mt-1 max-h-72 overflow-y-auto rounded-md bg-surface py-1 ring-1 ring-border"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.product.slug}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={activeIndex === index}
            >
              <Link
                to={suggestion.href}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  closePanel();
                  onSubmit?.();
                }}
                className={`flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                  activeIndex === index
                    ? "bg-surface-muted text-ink"
                    : "text-ink hover:bg-surface-muted"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {suggestion.product.name}
                  </span>
                  <span className="block truncate text-xs text-ink-muted">
                    {suggestion.categoryLabel}
                    {suggestion.product.series
                      ? ` · ${suggestion.product.series}`
                      : ""}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-ink-muted">
                  {suggestion.priceLabel}
                </span>
              </Link>
            </li>
          ))}
          <li
            id={`${listboxId}-view-all`}
            role="option"
            aria-selected={activeIndex === viewAllIndex}
          >
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={goToSearchResults}
              className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeIndex === viewAllIndex
                  ? "bg-surface-muted text-link"
                  : "text-link hover:bg-surface-muted"
              }`}
            >
              View all results for &ldquo;{trimmed}&rdquo;
            </button>
          </li>
        </ul>
      )}

      {showPanel && trimmed.length >= 2 && suggestions.length === 0 && (
        <p
          role="status"
          className="absolute top-full right-0 left-0 z-[60] mt-1 rounded-md bg-surface px-3 py-2 text-sm text-ink-muted ring-1 ring-border"
        >
          No matching products
        </p>
      )}
    </div>
  );
}
