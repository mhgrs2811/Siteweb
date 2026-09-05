-- Données de démonstration pour `supabase db reset` (local uniquement).
insert into public.alerts (title, summary, body, severity, region, published_at) values
  ('Faux conseillers bancaires : vague d’appels signalée',
   'De nombreux signalements décrivent des appels se présentant comme le service anti-fraude d’une banque.',
   E'Depuis quelques jours, plusieurs personnes signalent des appels très convaincants.\n\nCe que vous pouvez faire :\n- Raccrochez.\n- Rappelez votre banque avec le numéro au dos de votre carte.\n- Ne validez jamais une opération que vous n’avez pas demandée.',
   'critical', 'FR', now() - interval '1 day'),
  ('SMS de livraison avec « frais à régler »',
   'Des SMS invitent à payer quelques euros pour recevoir un colis. Le lien mène à un faux site.',
   E'Le but réel est de récupérer les informations de votre carte bancaire.\n\n- Ne cliquez pas sur le lien.\n- Vérifiez sur le site officiel du transporteur.',
   'warning', null, now() - interval '4 days');

insert into public.learn_articles (slug, title, summary, body, category, reading_minutes, published_at) values
  ('reconnaitre-un-faux-conseiller-bancaire', 'Reconnaître un faux conseiller bancaire',
   'Les 5 signes qui doivent vous alerter quand « votre banque » vous appelle.',
   E'## Le scénario habituel\n\nOn vous appelle en se présentant comme le service anti-fraude de votre banque.\n\n## Les signes qui doivent vous alerter\n\n- On vous met la pression.\n- On vous demande un code reçu par SMS.\n- On vous propose de déplacer votre argent.\n\n## Ce que vous pouvez faire\n\nRaccrochez, puis rappelez votre banque avec le numéro au dos de votre carte.',
   'fake_bank', 3, now() - interval '30 days');
