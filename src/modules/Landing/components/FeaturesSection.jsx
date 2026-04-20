import FeatureCard from './FeatureCard.jsx'

export default function FeaturesSection({ group }) {
  if (!group?.items?.length) return null

  return (
    <section className="py-5" aria-labelledby={`${group.id}-heading`}>
      <div className="container">
        <h2 id={`${group.id}-heading`} className="visually-hidden">
          Features
        </h2>
        <div className="row g-4">
          {group.items.map((item) => (
            <FeatureCard
              key={item.title}
              iconClass={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
