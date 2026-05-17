"""Convert bergara.csv to e-commerce JSON."""
import csv
import json
import re
from pathlib import Path

CSV_PATH = Path(__file__).parent / "bergara.csv"
JSON_PATH = Path(__file__).parent / "bergara.json"


def parse_price(value: str) -> float | None:
    if not value or not str(value).strip():
        return None
    cleaned = re.sub(r"[$,\s]", "", str(value))
    try:
        return float(cleaned)
    except ValueError:
        return None


def clean(value: str) -> str | None:
    if value is None:
        return None
    s = str(value).strip()
    return s if s else None


def parse_numeric(value: str):
    v = clean(value)
    if v is None:
        return None
    try:
        if "." in v:
            return float(v)
        return int(v)
    except ValueError:
        return v


SPEC_FIELDS = [
    "weight",
    "overall_length",
    "barrel_length",
    "twist_rate",
    "magazine",
    "capacity",
]


def row_specs(row: dict) -> dict:
    mapping = {
        "Weight": "weight",
        "Overall Length": "overall_length",
        "Barrel Length": "barrel_length",
        "Twist Rate": "twist_rate",
        "Magazine": "magazine",
        "Capacity": "capacity",
    }
    specs = {}
    for csv_key, json_key in mapping.items():
        val = parse_numeric(row.get(csv_key, ""))
        if val is not None:
            specs[json_key] = val
    return specs


def variant_from_row(row: dict, category: str | None = None) -> dict:
    variant = {
        "sku": clean(row.get("Product Code", "")),
        "price": parse_price(row.get("Price (MSRP)", "")),
    }
    caliber = clean(row.get("Caliber", ""))
    handedness = clean(row.get("Handedness", ""))
    if caliber:
        variant["caliber"] = caliber
    if handedness:
        variant["handedness"] = handedness

    specs = row_specs(row)
    if category == "Magazines" and "capacity" in specs:
        variant["capacity"] = specs.pop("capacity")
    if specs:
        variant["specs"] = specs

    return variant


def product_from_parent(row: dict, variants: list[dict]) -> dict:
    category = clean(row.get("Category", ""))
    product = {
        "name": clean(row.get("Product", "")),
        "slug": clean(row.get("Slug", "")),
        "brand": clean(row.get("Brand", "")),
        "product_type": clean(row.get("Product Type", "")),
        "category": category,
        "series": clean(row.get("Series", "")),
        "variants": variants,
    }

    if category == "Rifles":
        product["variant_options"] = ["caliber", "handedness"]
    elif category == "Magazines":
        product["variant_options"] = ["caliber", "capacity"]

    return {k: v for k, v in product.items() if v is not None}


def convert():
    products = []
    current_parent = None
    current_variants = []

    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            product_name = clean(row.get("Product", ""))

            if product_name:
                if current_parent is not None:
                    products.append(product_from_parent(current_parent, current_variants))
                current_parent = row
                cat = clean(row.get("Category", ""))
                current_variants = [variant_from_row(row, cat)]
            elif current_parent is not None:
                cat = clean(current_parent.get("Category", ""))
                current_variants.append(variant_from_row(row, cat))

        if current_parent is not None:
            products.append(product_from_parent(current_parent, current_variants))

    catalog = {
        "brand": "Bergara",
        "currency": "USD",
        "categories": [
            {"id": "rifles", "name": "Rifles"},
            {"id": "magazines", "name": "Magazines"},
            {"id": "mats", "name": "Mats"},
            {"id": "rails", "name": "Rails"},
        ],
        "products": products,
    }

    with JSON_PATH.open("w", encoding="utf-8") as out:
        json.dump(catalog, out, indent=2, ensure_ascii=False)

    print(f"Wrote {len(products)} products to {JSON_PATH}")


if __name__ == "__main__":
    convert()
