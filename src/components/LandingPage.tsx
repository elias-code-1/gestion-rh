import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  Menu,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const features = [
  {
    icon: Users,
    number: '01',
    title: 'Un dossier par personne',
    description: 'Retrouvez les informations, documents et étapes de carrière de chaque collaborateur dans un espace clair.',
    color: 'mint',
  },
  {
    icon: CalendarDays,
    number: '02',
    title: 'Temps et absences',
    description: 'Visualisez les congés, suivez les absences et gardez le planning de l’équipe à jour.',
    color: 'lavender',
  },
  {
    icon: HeartHandshake,
    number: '03',
    title: 'Une équipe qui progresse',
    description: 'Structurez les entretiens, les objectifs et les parcours de formation au même endroit.',
    color: 'peach',
  },
  {
    icon: Banknote,
    number: '04',
    title: 'Les opérations simplifiées',
    description: 'Centralisez notes de frais, temps de travail, équipements et documents RH.',
    color: 'blue',
  },
  {
    icon: Network,
    number: '05',
    title: 'Une vue d’ensemble',
    description: 'Comprenez votre organisation grâce aux indicateurs, alertes et à l’organigramme.',
    color: 'yellow',
  },
  {
    icon: ShieldCheck,
    number: '06',
    title: 'Un suivi plus serein',
    description: 'Gardez une trace des actions et accédez rapidement aux informations utiles à votre gestion.',
    color: 'pink',
  },
];

const questions = [
  {
    question: 'À qui s’adresse Dossier RH ?',
    answer: 'Dossier RH accompagne les petites et moyennes équipes qui souhaitent mieux organiser leurs informations et leurs opérations RH au quotidien.',
  },
  {
    question: 'Puis-je essayer l’application ?',
    answer: 'Oui. Le bouton « Découvrir l’application » vous ouvre directement l’espace de démonstration, sans formulaire ni création de compte.',
  },
  {
    question: 'Mes données sont-elles hébergées en ligne ?',
    answer: 'Cette version de démonstration fonctionne avec la configuration du serveur de votre projet. Le mode d’hébergement et les garanties de sécurité dépendent de votre déploiement.',
  },
  {
    question: 'Est-ce un logiciel de paie ?',
    answer: 'Non. Dossier RH est un outil de suivi et d’organisation des ressources humaines ; il ne remplace pas un logiciel de paie.',
  },
];

const team = [
  { initials: 'CL', name: 'Camille Laurent', role: 'People & Culture', tone: 'avatar-lilac' },
  { initials: 'AD', name: 'Adam Dubois', role: 'Design produit', tone: 'avatar-peach' },
  { initials: 'SM', name: 'Sarah Martin', role: 'Développement', tone: 'avatar-blue' },
];

function DashboardPreview() {
  return (
    <div className="preview-window" aria-label="Aperçu du tableau de bord Dossier RH">
      <div className="preview-topbar">
        <div className="preview-brand"><span className="brand-mark">d.</span><span>Dossier <b>RH</b></span></div>
        <div className="preview-top-actions"><span className="preview-search">⌕&nbsp; Rechercher…</span><span className="preview-bell"><Bell size={15} /></span><span className="preview-profile">CL</span></div>
      </div>
      <div className="preview-body">
        <aside className="preview-sidebar">
          <span className="preview-nav-label">ESPACE RH</span>
          <span className="preview-nav-item active"><Sparkles size={14} /> Vue d’ensemble</span>
          <span className="preview-nav-item"><Users size={14} /> Collaborateurs</span>
          <span className="preview-nav-item"><CalendarDays size={14} /> Congés & absences</span>
          <span className="preview-nav-item"><GraduationCap size={14} /> Développement</span>
          <div className="preview-sidebar-note"><span className="sidebar-note-icon"><ShieldCheck size={15} /></span><b>Tout est en ordre</b><small>Votre équipe est à jour.</small></div>
        </aside>
        <div className="preview-content">
          <div className="preview-greeting"><div><span className="preview-eyebrow">MARDI 17 JUIN 2025</span><h3>Bonjour Camille <span>✳</span></h3><p>Voici ce qui se passe dans votre équipe.</p></div><button type="button" className="preview-button">+ Ajouter</button></div>
          <div className="preview-stats">
            <div className="preview-stat"><span>Collaborateurs</span><b>24 <small>+2</small></b><div className="mini-avatars"><i>CL</i><i>AD</i><i>SM</i><i>+21</i></div></div>
            <div className="preview-stat"><span>Présents aujourd’hui</span><b>21 <small className="stat-neutral">/ 24</small></b><div className="stat-track"><i /></div></div>
            <div className="preview-stat"><span>À traiter</span><b>03 <small className="stat-warn">demandes</small></b><span className="stat-caption">2 congés · 1 note de frais</span></div>
          </div>
          <div className="preview-lower">
            <div className="preview-panel team-panel"><div className="preview-panel-heading"><div><b>Votre équipe</b><small>Les dernières nouvelles</small></div><span>Tout voir <ArrowUpRight size={13} /></span></div>
              {team.map((person) => <div className="team-row" key={person.initials}><span className={`team-avatar ${person.tone}`}>{person.initials}</span><span className="team-person"><b>{person.name}</b><small>{person.role}</small></span><span className="team-status"><i /> Actif</span></div>)}
            </div>
            <div className="preview-panel activity-panel"><div className="preview-panel-heading"><div><b>À ne pas oublier</b><small>Vos prochaines actions</small></div><CircleHelp size={15} /></div>
              <div className="task-row"><span className="task-icon task-lilac"><FileCheck2 size={14} /></span><span><b>Valider les congés</b><small>2 demandes en attente</small></span><ArrowRight size={14} /></div>
              <div className="task-row"><span className="task-icon task-mint"><Clock3 size={14} /></span><span><b>Préparer les entretiens</b><small>Cette semaine · 3 rendez-vous</small></span><ArrowRight size={14} /></div>
              <div className="preview-progress"><span>Votre espace RH</span><b>Bien organisé <BadgeCheck size={14} /></b><div><i /></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  const enterApp = () => {
    setMenuOpen(false);
    onEnter();
  };

  return (
    <div className="marketing-site">
      <header className="site-header">
        <a className="site-logo" href="#accueil" aria-label="Dossier RH, accueil"><span className="brand-mark">d.</span><span>Dossier <b>RH</b></span></a>
        <button type="button" className="mobile-menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`site-nav ${menuOpen ? 'site-nav-open' : ''}`} aria-label="Navigation principale">
          <a href="#fonctionnalites" onClick={() => setMenuOpen(false)}>La solution</a>
          <a href="#methode" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
          <a href="#offres" onClick={() => setMenuOpen(false)}>Offres</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <button type="button" className="nav-login" onClick={enterApp}>Se connecter <ArrowUpRight size={14} /></button>
          <button type="button" className="button button-dark nav-cta" onClick={enterApp}>Découvrir l’application <ArrowRight size={15} /></button>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="accueil">
          <div className="hero-copy">
            <div className="eyebrow-pill"><span className="live-dot" /> LA GESTION RH, PLUS HUMAINE</div>
            <h1>Vous prenez soin<br />de votre équipe.<br /><span>On range le reste.</span></h1>
            <p className="hero-description">Les bons outils pour une gestion RH claire, fluide et plus sereine. Du premier jour aux prochaines ambitions de vos collaborateurs.</p>
            <div className="hero-actions">
              <button type="button" className="button button-primary" onClick={enterApp}>Découvrir l’application <ArrowRight size={17} /></button>
              <a className="button button-quiet" href="#fonctionnalites">Explorer la solution <ArrowDown size={15} /></a>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>CL</span><span>AD</span><span>SM</span><span>+</span></div><p><b>Tout votre quotidien RH.</b><br />Dans un seul espace, pensé pour les humains.</p></div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="floating-note note-top"><span className="note-icon note-icon-green"><Check size={15} /></span><span><b>Demande validée</b><small>Le repos, c’est important 🌿</small></span></div>
            <DashboardPreview />
            <div className="floating-note note-bottom"><span className="note-icon note-icon-purple"><Sparkles size={15} /></span><span><b>Une vue claire</b><small>Pour des décisions sereines</small></span></div>
            <span className="visual-sparkle sparkle-one">✳</span><span className="visual-sparkle sparkle-two">✴</span>
          </div>
          <a className="hero-scroll" href="#fonctionnalites"><span /> Faites défiler pour découvrir</a>
        </section>

        <section className="trust-strip" aria-label="Bénéfices de Dossier RH">
          <span>FAIT POUR LE QUOTIDIEN</span><div><Check size={15} /> Moins de tâches éparpillées</div><div><Check size={15} /> Plus de visibilité</div><div><Check size={15} /> Une équipe mieux accompagnée</div>
        </section>

        <section className="intro-section section-pad" id="fonctionnalites">
          <div className="section-heading">
            <span className="eyebrow">LE QUOTIDIEN, SANS LE CHAOS</span>
            <h2>Moins de tableurs.<br /><span>Plus de temps pour les gens.</span></h2>
          </div>
          <p className="section-intro-copy">Les informations RH finissent souvent partout — sauf là où on en a besoin. Dossier RH rassemble vos essentiels pour vous laisser vous concentrer sur ce qui compte vraiment.</p>
          <div className="feature-grid">
            {features.map(({ icon: Icon, number, title, description, color }) => (
              <article className="feature-card" key={number}>
                <div className="feature-card-top"><span className={`feature-icon ${color}`}><Icon size={20} strokeWidth={1.8} /></span><span>{number}</span></div>
                <h3>{title}</h3><p>{description}</p><ArrowUpRight className="feature-arrow" size={17} />
              </article>
            ))}
          </div>
        </section>

        <section className="manifesto-section">
          <div className="manifesto-shape shape-left">✳</div><div className="manifesto-shape shape-right">✳</div>
          <div className="manifesto-content"><span className="eyebrow eyebrow-light">BIEN PLUS QU’UN TABLEAU DE BORD</span><h2>La RH n’est pas une pile de dossiers.<br /><span>C’est une histoire d’équipe.</span></h2><p>Chaque arrivée, chaque projet, chaque petite victoire mérite d’être bien accompagnée. Faites de la place pour les conversations qui font avancer votre équipe.</p><button type="button" className="button button-light" onClick={enterApp}>Voir l’espace RH <ArrowRight size={16} /></button></div>
        </section>

        <section className="workflow-section section-pad" id="methode">
          <div className="section-heading workflow-heading"><span className="eyebrow">SIMPLE COMME BONJOUR</span><h2>De la première journée<br />à la prochaine <span>étape.</span></h2><p>Une place pour chaque moment qui compte dans la vie de votre équipe.</p></div>
          <div className="workflow-steps">
            <div className="workflow-line" />
            <article className="workflow-step"><span className="step-number">01</span><span className="step-icon step-one"><Users size={21} /></span><h3>Tout commence<br />avec une personne</h3><p>Un dossier clair pour retrouver le parcours et les informations de chacun.</p></article>
            <article className="workflow-step"><span className="step-number">02</span><span className="step-icon step-two"><CalendarDays size={21} /></span><h3>Le quotidien<br />se coordonne</h3><p>Congés, temps, absences : chacun sait ce qui se passe et quand.</p></article>
            <article className="workflow-step"><span className="step-number">03</span><span className="step-icon step-three"><Sparkles size={21} /></span><h3>Les talents<br />s’épanouissent</h3><p>Entretiens, objectifs et formations accompagnent chaque progression.</p></article>
          </div>
        </section>

        <section className="offer-section section-pad" id="offres">
          <div className="offer-copy"><span className="eyebrow">À VOTRE RYTHME</span><h2>Vos équipes évoluent.<br /><span>Votre espace aussi.</span></h2><p>Commencez par organiser l’essentiel, puis explorez les outils qui correspondent à votre façon de travailler. Pas besoin de tout changer pour faire un premier pas.</p><button type="button" className="button button-primary" onClick={enterApp}>Explorer l’application <ArrowRight size={16} /></button><small>La démonstration s’ouvre directement, sans inscription.</small></div>
          <div className="offer-cards">
            <article className="offer-card offer-card-simple"><div className="offer-card-heading"><span className="offer-symbol"><Users size={18} /></span><span>POUR LES PETITES ÉQUIPES</span></div><h3>Les essentiels, au même endroit.</h3><p>Un point de départ pour clarifier le suivi de votre équipe, sans ajouter de complexité.</p><ul><li><Check size={15} /> Dossiers collaborateurs</li><li><Check size={15} /> Congés et absences</li><li><Check size={15} /> Vue d’ensemble RH</li></ul><button type="button" onClick={enterApp}>Voir les essentiels <ArrowRight size={15} /></button></article>
            <article className="offer-card offer-card-growth"><div className="offer-card-heading"><span className="offer-symbol"><Sparkles size={18} /></span><span>POUR LES ÉQUIPES EN MOUVEMENT</span></div><h3>Plus de suivi, moins d’angles morts.</h3><p>Des outils complémentaires pour accompagner la croissance de vos pratiques RH.</p><ul><li><Check size={15} /> Entretiens et formations</li><li><Check size={15} /> Temps, frais et équipements</li><li><Check size={15} /> Indicateurs et alertes</li></ul><button type="button" onClick={enterApp}>Explorer les outils <ArrowRight size={15} /></button></article>
          </div>
          <p className="offer-note"><ShieldCheck size={15} /> Une démonstration produit est disponible. Les tarifs et modalités dépendent de votre projet.</p>
        </section>

        <section className="quote-section section-pad">
          <span className="eyebrow">LE BON OUTIL CHANGE LE QUOTIDIEN</span><div className="quote-mark">“</div><blockquote>Quand l’administratif est à sa place,<br />on retrouve du temps <span>pour les personnes.</span></blockquote><div className="quote-attribution"><span className="quote-avatar">RH</span><span><b>Et si c’était votre équipe ?</b><small>Découvrez Dossier RH par vous-même</small></span><button type="button" className="quote-link" onClick={onEnter}>Entrer dans l’application <ArrowRight size={15} /></button></div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="faq-heading"><span className="eyebrow">ON VOUS RÉPOND</span><h2>Les bonnes questions,<br /><span>les réponses claires.</span></h2><p>Une question qui n’est pas dans la liste ? Écrivez-nous pour nous parler de votre projet.</p><a href="mailto:bonjour@dossier-rh.fr">bonjour@dossier-rh.fr <ArrowUpRight size={14} /></a></div>
          <div className="faq-list">{questions.map(({ question, answer }, index) => {
            const isOpen = openQuestion === index;
            return <article className={`faq-item ${isOpen ? 'faq-item-open' : ''}`} key={question}><button type="button" onClick={() => setOpenQuestion(isOpen ? null : index)} aria-expanded={isOpen}><span>{question}</span><span className="faq-chevron"><ChevronDown size={17} /></span></button>{isOpen && <p>{answer}</p>}</article>;
          })}</div>
        </section>

        <section className="final-cta"><div className="final-cta-shape">✳</div><div><span className="eyebrow eyebrow-light">ON Y VA ?</span><h2>Votre équipe mérite<br />un RH qui respire.</h2><p>Faites le premier pas. La démo vous attend.</p></div><button type="button" className="button button-light" onClick={onEnter}>Découvrir Dossier RH <ArrowRight size={16} /></button></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><a className="site-logo footer-logo" href="#accueil"><span className="brand-mark">d.</span><span>Dossier <b>RH</b></span></a><p>La gestion RH qui remet<br />les personnes au centre.</p><div className="footer-links"><a href="#fonctionnalites">La solution</a><a href="#methode">Comment ça marche</a><a href="#offres">Offres</a><a href="#faq">FAQ</a></div><button type="button" className="footer-cta" onClick={onEnter}>Accéder à la démo <ArrowUpRight size={15} /></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Dossier RH. Pensé pour les équipes.</span><a href="#accueil">Retour en haut ↑</a></div></footer>
    </div>
  );
}
