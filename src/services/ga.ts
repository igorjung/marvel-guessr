export const pageview = (url: string) => {
  window.gtag(
    'config', 
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    { page_path: url }
  )
}
  
export const event = (
  action: string, 
  category: string, 
  label: string, 
  value: string
) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}