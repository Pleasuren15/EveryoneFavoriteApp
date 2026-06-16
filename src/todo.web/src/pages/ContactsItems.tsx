import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, Trash2, Phone, Mail, Star, Heart, Users, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Contact, ContactGroup } from "@/lib/types"

const INITIAL_CONTACTS: Contact[] = [
  { id: "1", name: "Alice Johnson", phone: "+27 82 123 4567", email: "alice@example.com", group: "Friend", isFavorite: true },
  { id: "2", name: "Bob Smith", phone: "+27 72 234 5678", email: "bob@example.com", group: "Work", isFavorite: false },
  { id: "3", name: "Carol Williams", phone: "+27 62 345 6789", email: "carol@example.com", group: "Family", isFavorite: true },
  { id: "4", name: "David Brown", phone: "+27 82 456 7890", email: "david@example.com", group: "Work", isFavorite: false },
  { id: "5", name: "Eve Davis", phone: "+27 72 567 8901", email: "eve@example.com", group: "Friend", isFavorite: false },
  { id: "6", name: "Frank Miller", phone: "+27 62 678 9012", email: "frank@example.com", group: "Other", isFavorite: true },
  { id: "7", name: "Grace Wilson", phone: "+27 82 789 0123", email: "grace@example.com", group: "Family", isFavorite: false },
  { id: "8", name: "Henry Taylor", phone: "+27 72 890 1234", email: "henry@example.com", group: "Work", isFavorite: false },
]

const GROUPS: ContactGroup[] = ["Family", "Friend", "Work", "Other"]

const GROUP_STYLES: Record<ContactGroup, string> = {
  Family: "bg-rose-500/20 text-rose-300",
  Friend: "bg-sky-500/20 text-sky-300",
  Work: "bg-amber-500/20 text-amber-300",
  Other: "bg-slate-500/20 text-slate-300",
}

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  group: z.string(),
})

export function ContactsItems() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterGroup, setFilterGroup] = useState<ContactGroup | "all">("all")
  const [sortFavorites, setSortFavorites] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", group: "Friend" },
  })

  const filteredContacts = useMemo(() => {
    let result = contacts

    if (filterGroup !== "all") {
      result = result.filter((c) => c.group === filterGroup)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      )
    }

    if (sortFavorites) {
      result = [...result].sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1))
    }

    return result
  }, [contacts, filterGroup, searchQuery, sortFavorites])

  const favoriteCount = contacts.filter((c) => c.isFavorite).length

  const toggleFavorite = (id: string) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)))
  }

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const addContact = (data: { name: string; phone: string; email: string; group: string }) => {
    const contact: Contact = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      group: data.group as ContactGroup,
      isFavorite: false,
    }
    setContacts((prev) => [contact, ...prev])
    reset()
  }

  return (
    <div className="h-svh flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Button
              onClick={() => navigate("/todos")}
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Contacts</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {contacts.length} contacts &middot; {favoriteCount} favorites
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select
                value={filterGroup}
                onValueChange={(v) => setFilterGroup(v as ContactGroup | "all")}
              >
                <SelectTrigger className="w-36 !h-9 border-white/10 bg-black/30 backdrop-blur-xl text-white text-xs flex-shrink-0">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black/90 text-white text-xs">
                  <SelectItem value="all">All Groups</SelectItem>
                  {GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortFavorites(!sortFavorites)}
                className={`!h-9 border-white/10 bg-black/30 text-xs ${
                  sortFavorites ? "text-yellow-400 border-yellow-500/30" : "text-slate-300"
                }`}
              >
                <Star className={`w-3.5 h-3.5 mr-1 ${sortFavorites ? "fill-yellow-400" : ""}`} />
                Favorites first
              </Button>

              {filterGroup !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white !h-9"
                  onClick={() => setFilterGroup("all")}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Contact List */}
          <div className="space-y-2">
            {filteredContacts.length === 0 ? (
              <Card className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                  <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">No contacts found</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {searchQuery ? "Try a different search" : "Add a contact to get started"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                          {contact.isFavorite && (
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${GROUP_STYLES[contact.group]}`}>
                            {contact.group}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleFavorite(contact.id)}
                          className="p-2 text-slate-500 hover:text-yellow-400 transition-colors cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${contact.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="p-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-700 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Contact Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-sm:p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DialogHeader className="text-center">
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
            addContact(data)
            setAddOpen(false)
          })} className="flex flex-col items-center gap-4 mt-2">
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Name</label>
              <Input
                type="text"
                placeholder="Full name"
                {...register("name")}
                className="h-11 w-full bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Phone</label>
              <Input
                type="tel"
                placeholder="Phone"
                {...register("phone")}
                className="h-11 w-full bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="h-11 w-full bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Group</label>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="!h-11 w-full bg-zinc-800/80 border-zinc-700 text-white text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUPS.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full max-w-sm bg-gradient-to-r from-violet-700 to-violet-600 text-white hover:shadow-lg transition-all cursor-pointer h-11"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Contact
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
