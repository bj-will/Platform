import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import * as icons from '@tabler/icons-preact';
import '../../styles/components/cards.css'
import ProjectLogo from "../ui/ProjectLogo";

import {IconCheck,
Icon,
IconStarFilled,
IconStar,
IconNews,
IconBrandDiscord,
IconBrandTwitter,
IconWorld,
IconClock} from '@tabler/icons-preact';

import type { EventItem } from '../../types/api'
import { useUIStore } from '../../store/uiStore'

const categoryIcons: Record<string, any> = {
  nft: icons.IconPalette,
  gaming: icons.IconDeviceGamepad2,
  blockchain: icons.IconCoinBitcoin,
  "de-fi": icons.IconBuildingBank,
  meme: icons.IconMoodSmile,
  ai: icons.IconCpu,
  Event: icons.IconCalendarEvent,
  News: icons.IconNews,
  AMA: icons.IconSpeakerphone,
  WL: icons.IconList,
  Collab: icons.IconUsers,
  Airdrop: icons.IconCloudUpload,
  Role: icons.IconUser,
}

const statusColors: Record<string, string> = {
  live: 'bg-success text-white',
  upcoming: 'bg-orange text-white',
  closed: 'bg-danger text-white',
  inactive: 'bg-black text-white'
}


export default function EventCard({
  event,
  project,
  relatedProject
}: {
  event: EventItem,
  project: Project,
  relatedProject?: Project
}) {
  const toggle = useUIStore(s => s.toggleComplete)
  const isComplete = useUIStore(s => s.isComplete(event.id))
  const setPriority = useUIStore(s => s.setPriority)
  const priority = useUIStore(s => s.getPriority(event.id)) || 'normal'
  const [timeLeft, setTimeLeft] = useState('')
  const [totalHours, setTotalHours] = useState(0);
  const openPage = () => {
    window.location.href = `/event/${event.id}`;
  };
  const effectiveProject = relatedProject || project;
  useEffect(() => {
    const updateTimer = () => {
      if (!event.date) {
        setTimeLeft('');
        setTotalHours(0);
        return;
      }
      const endDate = new Date(event.date);
      const day = String(endDate.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
      const month = String(endDate.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
      const year = endDate.getFullYear(); // Get full year

      const formattedDate = `${day}-${month}-${year}`;

      const end = endDate.getTime();
      const diff = end - Date.now();
      if (diff <= 0) {
        setTimeLeft(`${formattedDate} | Ended`);
        setTotalHours(0);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${formattedDate} | ${days}d ${hours}h ${minutes}m`);
      setTotalHours(days * 24 + hours + minutes / 60);
    };

    updateTimer();
    const t = setInterval(updateTimer, 60000);
    return () => clearInterval(t);
  }, [event.date]);

  const isUrgent = totalHours < 24*7;
  const logoUrl = `/projects/logo/${effectiveProject.slug}_logo.png`
  const bgUrl = `/projects/banner/${effectiveProject.slug}_banner.png`

  return (
    <div
      class="card overflow-hidden position-relative"
      style={{
        width: '100%',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
      }}
//       onClick={openPage}
    >
      {/* Upper */}
      <div
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '120px',
          position: 'relative'
        }}
      >
        {/* Top-left check */}
        <div
          onClick={e => {
            e.stopPropagation();
            toggle(event.id);
          }}
          class="position-absolute top-0 start-0 m-2 d-flex align-items-center"
          style={{
            cursor: 'pointer',
            zIndex: 3,
            gap: '6px' // space between circle and text
          }}
        >
          {/* Green circle */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: isComplete ? 'green' : undefined,
              border: '2px solid #4A5568',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isComplete ? 'Completed' : 'Mark as done'}
          >
            {isComplete && <IconCheck size={16} />}
          </div>

          {/* Completed text */}
          {isComplete && (
            <span class="completed-text">
              Completed
            </span>
          )}
        </div>

        {/* Status */}
        {event.status && (
          <span
            class={`badge ${statusColors[event.status]} position-absolute m-2`}
            style={{ top: 0, right: 0 }}
          >
            {event.status.toUpperCase()}
          </span>
        )}
      </div>

    {/* Lower */}
    <div class="card-body pt-3 d-flex flex-column position-relative"
         style={{ flexGrow: 1 }}
         >
        {/* Categories */}
        {Array.isArray(event.categories) && event.categories.length > 0 && (
          <div
            class="position-absolute d-flex flex-wrap gap-1"
            style={{
              top: '0rem',
              right: '0rem',
              zIndex: 1              // badges below logo's zIndex
            }}
          >
            {event.categories.map(cat => {
              const Icon = categoryIcons[cat] || icons.IconWorld
              return (
                <span
                  class="badge d-inline-flex align-items-center gap-1 shadow-sm"
                  key={cat}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    lineHeight: 1.2
                  }}
                >
                  <Icon size={14} /> {cat.toUpperCase()}
                </span>
              )
            })}
          </div>
        )}

        {/* Logo */}
        <ProjectLogo
          projectSlug={effectiveProject.slug}
          size={64}
          position={{ top: "-32px", left: "16px" }}
        />

        {/* Title & rating */}
        <div class="d-flex justify-content-between align-items-center flex-nowrap mt-5">
          <h5 class="mb-1 text-truncate" style={{ maxWidth: '70%' }}>{event.title}</h5>
          <div class="flex-shrink-0 d-flex">
            {Array.from({ length: 5 }).map((_, i) =>
              i < (event.rating || 0) ? (
                <IconStarFilled key={i} size={16} class="text-warning" />
              ) : (
                <IconStar key={i} size={16} class="text-muted" />
              )
            )}
          </div>
        </div>

        {/* Description */}
        <p class="text-muted mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '3em',
          lineHeight: '1.5em',
        }}
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
          {/* Actions Row */}
          <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
            {event.newsLink && (
              <a
                href={event.newsLink}
                class="btn btn-sm btn-outline-secondary"
                target="_blank"
                rel="noreferrer"
                title="Link to News"
                style={{ flex: '0 0 auto' }}
              >
                <IconNews size={16} />
              </a>
            )}
            {effectiveProject.discord && (
              <a
                href={`https://discord.gg/${effectiveProject.discord}`}
                class="btn btn-sm btn-outline-secondary"
                target="_blank"
                rel="noreferrer"
                title="Project Discord"
                style={{ flex: '0 0 auto' }}
              >
                <IconBrandDiscord size={16} />
              </a>
            )}
            {effectiveProject.twitter && (
              <a
                href={`https://x.com/${effectiveProject.twitter}`}
                class="btn btn-sm btn-outline-secondary"
                target="_blank"
                rel="noreferrer"
                title="Project Twitter"
                style={{ flex: '0 0 auto' }}
              >
                <IconBrandTwitter size={16} />
              </a>
            )}
            {effectiveProject.site && (
              <a
                href={effectiveProject.site}
                class="btn btn-sm btn-outline-secondary"
                target="_blank"
                rel="noreferrer"
                title="Project Site"
                style={{ flex: '0 0 auto' }}
              >
                <IconWorld size={16} />
              </a>
            )}
          </div>

        {/* Timer */}
        {timeLeft && (
                  <small
          class={`fw-bold mt-auto d-flex align-items-center gap-1 ${
            isUrgent ? 'text-danger' : 'text-primary'
          }`}
        >
            <IconClock size={14} /> {timeLeft}
          </small>
        )}
      </div>
      {/* Dark overlay when done */}
      {isComplete && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            zIndex:2
          }}
        />
      )}
    </div>
  )

}
