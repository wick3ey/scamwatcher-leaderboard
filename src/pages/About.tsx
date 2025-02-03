import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leaderboard
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
          About Our Mission
        </h1>

        <div className="space-y-8 text-lg leading-relaxed">
          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Our Purpose</h2>
            <p className="mb-4">
              We are a community-driven platform dedicated to exposing and combating cryptocurrency scams perpetrated by influential figures. Our mission is to protect innocent investors and restore integrity to the crypto community.
            </p>
            <p>
              Too often, high-profile individuals abuse their influence to profit from fraudulent schemes, leaving community members devastated and without recourse. We're here to change that by giving the community a voice and providing a path to legal action.
            </p>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Nomination Process</h3>
                <p>Anyone can nominate a suspected scammer to our platform. The nomination will enter our pending list where the community can review and vote.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Community Verification</h3>
                <p>A nomination needs to reach 500 votes to be moved to our main leaderboard. This threshold ensures community consensus on legitimate cases.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Investigation & Evidence Gathering</h3>
                <p>Once a nomination reaches 500 votes, our team initiates a thorough investigation to gather comprehensive evidence about the scam and the perpetrator's activities.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Legal Action</h3>
                <p>With the evidence gathered by our team and community signatures, we forward the complete case file to our partnered law firms. These specialized firms will pursue legal action regardless of the perpetrator's location. The more signatures we collect, the stronger our case becomes.</p>
              </div>
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Public Exposure</h2>
            <div className="space-y-4">
              <p>Beyond legal action, we maintain a public leaderboard of confirmed scammers to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Warn potential victims before they become targets</li>
                <li>Create public awareness about common scam tactics</li>
                <li>Deter other potential scammers through public exposure</li>
                <li>Help the community identify and avoid known bad actors</li>
              </ul>
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-4">Using the Platform</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Viewing Scammers</h3>
                <p>Browse the main leaderboard to see confirmed scammers or check the pending nominations section for recent submissions that are still gathering community votes.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Voting and Signing</h3>
                <p>You can vote on pending nominations to help them reach the investigation threshold. For confirmed scammers, your signature strengthens our legal case against them.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Making Nominations</h3>
                <p>When submitting a new nomination, provide basic information about the suspected scammer. Our team will handle the detailed investigation and evidence gathering once the nomination reaches 500 votes.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;