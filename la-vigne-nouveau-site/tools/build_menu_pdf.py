#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère la carte complète de La Vigne en PDF, dans l'identité du nouveau site."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
    TableStyle, NextPageTemplate, PageBreak
)

INK = colors.HexColor("#17140f")
CHARCOAL = colors.HexColor("#23201b")
CREAM = colors.HexColor("#f7f1e6")
GOLD = colors.HexColor("#a8813a")
EMBER = colors.HexColor("#c1502e")
MUTED = colors.HexColor("#5c574c")
LINE = colors.HexColor("#ded2b8")

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm

styles = {
    "h1": ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=26, leading=28,
                          textColor=INK, alignment=TA_CENTER, spaceAfter=2),
    "sub": ParagraphStyle("sub", fontName="Helvetica", fontSize=10.5, leading=14,
                           textColor=MUTED, alignment=TA_CENTER, spaceAfter=0),
    "tag": ParagraphStyle("tag", fontName="Helvetica-Oblique", fontSize=9.5, leading=12,
                           textColor=EMBER, alignment=TA_CENTER, spaceAfter=0),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=12.5,
                               leading=15, textColor=EMBER, spaceBefore=14, spaceAfter=6),
    "item": ParagraphStyle("item", fontName="Helvetica", fontSize=9.1, leading=12,
                            textColor=INK, alignment=TA_LEFT),
    "itemdesc": ParagraphStyle("itemdesc", fontName="Helvetica-Oblique", fontSize=7.6,
                                leading=9.5, textColor=MUTED, alignment=TA_LEFT),
    "price": ParagraphStyle("price", fontName="Helvetica-Bold", fontSize=9.1, leading=12,
                             textColor=CHARCOAL, alignment=TA_RIGHT),
    "note": ParagraphStyle("note", fontName="Helvetica-Oblique", fontSize=8, leading=11,
                            textColor=MUTED, alignment=TA_LEFT),
}


def item_row(name, price, desc=None):
    cell = [Paragraph(name, styles["item"])]
    if desc:
        cell.append(Paragraph(desc, styles["itemdesc"]))
    return [cell, Paragraph(price, styles["price"])]


def section(flow, title, rows, col_widths):
    flow.append(Paragraph(title.upper(), styles["section"]))
    t = Table(rows, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE),
    ]))
    flow.append(t)


def draw_background(c, doc):
    c.saveState()
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    band_h = 12 * mm
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, band_h, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawCentredString(PAGE_W / 2, band_h - 6.5 * mm,
                         "LA VIGNE  ·  Rue Jourdan 6, 1060 Bruxelles (Saint-Gilles)  ·  02 / 538 12 07  ·  www.la-vigne.be")
    c.setFont("Helvetica", 7.4)
    c.setFillColor(colors.HexColor("#cfc6b3"))
    c.drawCentredString(PAGE_W / 2, band_h - 10 * mm, f"Page {doc.page}")
    c.restoreState()


def build():
    doc = BaseDocTemplate(
        "../assets/carte-la-vigne.pdf",
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN + 12 * mm,
        title="La Vigne — Carte complète",
        author="La Vigne",
    )
    gutter = 10 * mm
    col_w = (PAGE_W - 2 * MARGIN - gutter) / 2
    frame_l = Frame(MARGIN, MARGIN + 12 * mm, col_w, PAGE_H - 2 * MARGIN - 12 * mm, id="L",
                     leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    frame_r = Frame(MARGIN + col_w + gutter, MARGIN + 12 * mm, col_w, PAGE_H - 2 * MARGIN - 12 * mm, id="R",
                     leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    frame_full = Frame(MARGIN, MARGIN + 12 * mm, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN - 12 * mm, id="F",
                        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    doc.addPageTemplates([
        PageTemplate(id="two-col", frames=[frame_l, frame_r], onPage=draw_background),
        PageTemplate(id="one-col", frames=[frame_full], onPage=draw_background),
    ])

    story = []
    PRICE_W = 56
    cw2 = [col_w - PRICE_W, PRICE_W]
    cw_full = [PAGE_W - 2 * MARGIN - PRICE_W, PRICE_W]

    # ================= Movement A — two columns: cover + entrées + moules + mer + salades + enfants =================
    story.append(Paragraph("LA VIGNE", styles["h1"]))
    story.append(Paragraph("Restaurant · Brasserie méditerranéenne", styles["sub"]))
    story.append(Paragraph("Depuis 1985 — Rue Jourdan 6, 1060 Saint-Gilles", styles["tag"]))
    story.append(Spacer(1, 5 * mm))
    hr = Table([[""]], colWidths=[col_w], rowHeights=[0.6])
    hr.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.8, GOLD)]))
    story.append(hr)
    story.append(Spacer(1, 3 * mm))

    section(story, "Entrées &amp; mises en bouche", [
        item_row("Mix d'olives grecques vertes &amp; noires", "4,90 €"),
        item_row("Feuilles de vigne farcies au riz", "9,00 €"),
        item_row("Tarama", "9,90 €", "Œuf de cabillaud, citron, huile d'olive"),
        item_row("Tzatziki", "9,90 €", "Yaourt, concombre, ail"),
        item_row("Boulettes de viande hachée de veau", "9,50 €", "Yaourt au miel et à la menthe"),
        item_row("Feuilletés farcis aux épinards et fêta", "12,00 €"),
        item_row("Planche de charcuterie sélectionnée par le Chef", "14,90 €"),
        item_row("Poêlée de moules, tomates et fêta", "15,00 €"),
        item_row("Os à moelle", "17,90 €"),
        item_row("Carpaccio de bœuf, copeaux de parmesan, huile à la truffe", "18,90 €"),
        item_row("Croquettes au fromage", "18,90 €"),
        item_row("Foie gras de canard, confiture d'oignons et toasts (1 tranche)", "18,90 €"),
        item_row("Foie gras de canard, confiture d'oignons et toasts (2 tranches)", "28,90 €"),
        item_row("Toast au saumon fumé, oignons et persil", "19,90 €"),
        item_row("Croquettes aux crevettes grises", "19,90 €"),
        item_row("Scampis beurre à l'ail", "19,90 €"),
        item_row("Calamars frits, salade et tzatziki (entrée)", "19,90 €"),
        item_row("Calamars frits, salade et tzatziki (plat)", "26,90 €"),
        item_row("Gambas grillées, salade et tzatziki (6 pc.)", "21,00 €"),
        item_row("Gambas grillées, salade et tzatziki (9 pc.)", "27,00 €"),
        item_row("Poulpe grillé", "23,90 €"),
    ], cw2)

    section(story, "Les moules", [
        item_row("Moules marinières", "28,90 €"),
        item_row("Moules au vin blanc", "29,90 €"),
        item_row("Moules crème à l'ail", "29,90 €"),
        item_row("Moules au curry", "29,90 €"),
        item_row("Moules provençale", "29,90 €", "Tomates et légumes"),
    ], cw2)

    section(story, "La mer", [
        item_row("Brochette de scampis, lard, mayo, aïoli, safran", "23,90 €"),
        item_row("Saumon grillé à la béarnaise, légumes du jour", "25,90 €"),
        item_row("Bar grillé", "33,90 €"),
        item_row("Sole meunière", "37,90 €"),
    ], cw2)

    section(story, "Les salades", [
        item_row("Salade grecque", "17,90 €", "Tomates, concombre, olives, fêta"),
        item_row("Salade niçoise", "19,90 €", "Tomates, thon, poivrons, œufs, olives, anchois"),
        item_row("Salade de chèvre chaud", "19,90 €"),
        item_row("Salade César", "22,90 €", "Poulet grillé, parmesan, croûtons"),
        item_row("Salade saumon fumé et scampis", "24,90 €"),
    ], cw2)

    section(story, "Menus enfants (jusqu'à 12 ans)", [
        item_row("Spaghetti bolognaise", "14,50 €"),
        item_row("Brochettes poulet ou porc, frites et salade", "14,50 €"),
        item_row("Boulettes sauce tomate et frites", "14,50 €"),
    ], cw2)
    story.append(Paragraph("+ une boule de glace au choix", styles["note"]))

    # ================= Movement B — one column: grillades / rôtisserie / pâtes =================
    story.append(NextPageTemplate("one-col"))
    story.append(PageBreak())

    section(story, "Plats &amp; grillades au feu de bois", [
        item_row("Petites brochettes de poulet ou porc (3 pcs), salade", "19,90 €"),
        item_row("Brochettes de poulet (3 pcs) avec poêlée de légumes", "24,90 €"),
        item_row("Mixte brochette de porc et poulet (4 pcs), salade", "23,90 €"),
        item_row("Brochette d'agneau grillée, salade, frites", "25,90 €"),
        item_row("Gyros de poulet ou porc, pain pitta, tzatziki, salade", "21,90 €"),
        item_row("Spare ribs, salade, frites", "21,90 €"),
        item_row("Soutzoukakia maison", "21,00 €", "Boulettes de viande grecque aux épices méditerranéennes, salade"),
        item_row("Moussaka fait « maison »", "21,90 €"),
        item_row("Lapin aux échalotes tomatées", "22,50 €"),
        item_row("Carpaccio de bœuf, copeaux de parmesan, huile à la truffe", "24,90 €"),
        item_row("Le plat signature — filet mignon de bœuf, frites et salade", "26,90 €"),
        item_row("Tomahawk de porc, salade", "33,90 €"),
        item_row("Entrecôte irlandaise, salade", "35,90 €"),
        item_row("Côte à l'os irlandaise (± 500 g, 1 personne)", "39,90 €"),
        item_row("Côte à l'os irlandaise (± 1,2 kg, 2 personnes)", "85,00 €"),
        item_row("Tomahawk de bœuf irlandais (± 1 kg, 2 personnes), salade", "85,90 €"),
        item_row("Assortiment de légumes à l'huile d'olive", "16,90 €"),
    ], cw_full)

    section(story, "Rôtisserie du jour", [
        item_row("Coquelet rôti, sauce champignons", "23,90 €"),
        item_row("Cochon de lait à la broche", "32,90 €", "Gratin dauphinois et béarnaise à la menthe"),
        item_row("Épaule d'agneau (2 convives)", "59,90 €", "Jus de viande et gratin dauphinois"),
    ], cw_full)

    section(story, "Les pâtes", [
        item_row("Spaghetti bolognaise", "16,90 €"),
        item_row("Tagliatelle provençale", "17,90 €", "Végétarien"),
        item_row("Pasticcio", "17,90 €", "Penne, haché de bœuf, fromage et béchamel gratinée"),
        item_row("Pâtes au saumon, crème aux fines herbes", "23,90 €"),
    ], cw_full)

    story.append(Spacer(1, 3 * mm))
    note_box = Table([[Paragraph(
        "Tous nos plats sont accompagnés, au choix, de : frites belges maison · riz basmati · "
        "croquettes de pomme de terre · brochette de pomme de terre grenaille · écrasé de pommes de terre "
        "au feu de bois, tomates séchées, basilic.<br/><br/>"
        "Sauces au choix (supplément 4,50 €) : poivre vert, poivre concassé, béarnaise, archiduc, "
        "provençale, roquefort. Légumes de saison en supplément : 8,90 €.",
        styles["note"])]], colWidths=[PAGE_W - 2 * MARGIN])
    note_box.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#efe6d4")),
        ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(note_box)

    # ================= Movement C — two columns: bar & boissons =================
    story.append(NextPageTemplate("two-col"))
    story.append(PageBreak())

    section(story, "Apéritifs &amp; alcools", [
        item_row("Pastis", "10,00 €"), item_row("Picon vin blanc", "9,00 €"),
        item_row("Pineau des Charentes", "9,00 €"), item_row("Porto rouge ou blanc", "9,00 €"),
        item_row("Martini rouge ou blanc", "9,00 €"), item_row("Gancia", "9,00 €"),
        item_row("Kir vin blanc", "10,00 €"), item_row("Kir royal", "12,00 €"),
        item_row("Campari", "12,00 €"), item_row("Pisang", "12,00 €"), item_row("Ouzo", "12,00 €"),
        item_row("Bacardi", "12,00 €"), item_row("Havana brun", "12,00 €"),
        item_row("Gin Gordon's", "12,00 €"), item_row("Cointreau", "10,00 €"),
        item_row("Vodka Absolut", "10,00 €"), item_row("Bacardi 8 years old", "15,00 €"),
        item_row("Diplomatico", "14,00 €"), item_row("Gin Bombay", "14,00 €"),
        item_row("Gin Hendrick's", "14,00 €"), item_row("Vodka Grey Goose", "14,00 €"),
        item_row("Rémy Martin Cognac XO", "35,00 €"), item_row("Hennessy Cognac XO", "35,00 €"),
    ], cw2)

    section(story, "Whisky", [
        item_row("J&amp;B", "12,00 €"), item_row("Jack Daniel's", "12,00 €"),
        item_row("Johnnie Walker Red", "12,00 €"), item_row("Chivas", "14,00 €"),
        item_row("Singleton 10 years", "16,00 €"), item_row("Lagavulin 16 years", "16,00 €"),
        item_row("Macallan Gold", "18,00 €"), item_row("Talisker", "18,00 €"),
    ], cw2)

    section(story, "Cocktails", [
        item_row("Gin 0%", "10,00 €"), item_row("Mojito virgin", "10,00 €"),
        item_row("Mojito", "12,00 €"), item_row("Aperol Spritz", "12,00 €"),
        item_row("Espresso Martini", "12,00 €"), item_row("Margarita", "12,00 €"),
        item_row("Passion Fruit Martini", "12,00 €"), item_row("Piña Colada", "12,00 €"),
        item_row("Cuba Libre", "12,00 €"),
    ], cw2)

    section(story, "Softs &amp; jus", [
        item_row("Coca-Cola / Zéro", "4,00 €"), item_row("Fanta / Sprite", "4,00 €"),
        item_row("Fuzetea / Tonic", "4,00 €"),
        item_row("Jus (orange, pomme, tomate, pamplemousse, ananas)", "4,00 €"),
        item_row("Eau plate ou pétillante — 25 cl", "4,00 €"),
        item_row("Eau plate ou pétillante — 50 cl", "6,00 €"),
    ], cw2)

    section(story, "Boissons chaudes", [
        item_row("Café / Décaféiné", "4,00 €"), item_row("Espresso", "4,00 €"),
        item_row("Thé &amp; infusions", "4,00 €"),
        item_row("Chocolat chaud belge Callebaut", "4,00 €"),
        item_row("Cappuccino / Latte Macchiato", "4,50 €"),
        item_row("Thé à la menthe fraîche", "4,50 €"),
    ], cw2)

    section(story, "Bières au fût — 25 cl", [
        item_row("Stella Artois", "3,90 €"), item_row("Blanche de Hoegaarden", "4,90 €"),
        item_row("Leffe Blonde", "5,90 €"), item_row("Leffe Brune", "5,90 €"),
        item_row("Triple Karmeliet", "5,90 €"), item_row("Bière du mois", "5,90 €"),
    ], cw2)

    section(story, "Bières au fût — 50 cl", [
        item_row("Stella Artois", "7,50 €"), item_row("Blanche de Hoegaarden", "8,90 €"),
        item_row("Leffe Blonde", "9,90 €"), item_row("Leffe Brune", "9,90 €"),
        item_row("Triple Karmeliet", "9,90 €"), item_row("Bière du mois", "9,90 €"),
    ], cw2)

    section(story, "Bières bouteilles", [
        item_row("Jupiler 0%", "3,90 €"), item_row("Leffe Blonde 0%", "3,90 €"),
        item_row("Kriek Belle-Vue", "4,90 €"), item_row("Hoegaarden Rosée", "4,90 €"),
        item_row("Kwak Blonde", "5,90 €"), item_row("Kwak Rouge", "5,90 €"),
        item_row("Kwak Ambrée", "5,90 €"),
    ], cw2)

    section(story, "Champagnes &amp; bulles", [
        item_row("Coupe de cava brut", "10,00 €"), item_row("Coupe de champagne", "12,00 €"),
    ], cw2)

    section(story, "Bouteilles", [
        item_row("Cava brut", "39,00 €"), item_row("Champagne maison", "75,00 €"),
        item_row("Champagne Veuve Clicquot", "125,00 €"),
        item_row("Champagne Ruinart brut", "140,00 €"),
        item_row("Ruinart « Blanc de Blancs »", "240,00 €"),
    ], cw2)

    story.append(Spacer(1, 5 * mm))
    box = Table([[Paragraph(
        "<b>Infos &amp; horaires</b><br/>"
        "Ouvert du lundi au samedi — cuisine ouverte non-stop de 12h00 à 23h00 — dimanche fermé.<br/>"
        "Le restaurant peut être privatisé pour vos événements.<br/><br/>"
        "Merci de commander au moins un plat par personne. Pour l'emballage de vos plats à emporter, "
        "une participation de 1 € est demandée.<br/><br/>"
        "Rue Jourdan 6, 1060 Saint-Gilles · 02 / 538 12 07 · www.la-vigne.be<br/>"
        "Instagram @lavignebxl · Facebook La Vigne Restaurant",
        ParagraphStyle("boxnote", parent=styles["note"], alignment=TA_CENTER, fontSize=8.3, leading=11.5))]],
        colWidths=[col_w])
    box.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.6, GOLD),
        ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(box)

    doc.build(story)


if __name__ == "__main__":
    build()
