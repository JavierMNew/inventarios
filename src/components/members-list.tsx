"use client"

import * as React from "react"
import { MoreVertical, UserCheck, Trash2, Mail, Shield, ShieldAlert, Loader2, X } from "lucide-react"
import { actions } from "astro:actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface MemberProfile {
  first_name: string | null
  last_name: string | null
  email: string | null
}

export interface Member {
  user_id: string
  rol: 'owner' | 'admin' | 'contador' | 'ayudante'
  empresa_id: string
  profiles: MemberProfile | MemberProfile[] | null
}

interface MembersListProps {
  initialMembers: Member[]
  currentUserId: string
  companyId: string
  isAdminOrOwner: boolean
}

export function MembersList({ initialMembers, currentUserId, companyId, isAdminOrOwner }: MembersListProps) {
  const [members, setMembers] = React.useState<Member[]>(initialMembers)
  
  // State for modals
  const [editingMember, setEditingMember] = React.useState<Member | null>(null)
  const [deletingMember, setDeletingMember] = React.useState<Member | null>(null)
  
  // Loading states
  const [isSavingRole, setIsSavingRole] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  
  // Local state for role select
  const [selectedRole, setSelectedRole] = React.useState<'owner' | 'admin' | 'contador' | 'ayudante'>('ayudante')
  
  // Error messages
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Get dynamic background and text color for avatars
  const getAvatarColors = (name: string) => {
    const colors = [
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50",
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
      "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50",
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50",
      "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-900/50"
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  // Get dynamic styling for role badges
  const getRoleBadgeStyle = (rol: string) => {
    switch (rol) {
      case 'owner':
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/60 font-semibold"
      case 'admin':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 font-semibold"
      case 'contador':
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-medium"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-normal"
    }
  }

  // Open Edit Role modal
  const handleEditClick = (member: Member) => {
    setEditingMember(member)
    setSelectedRole(member.rol)
    setErrorMessage(null)
  }

  // Save new role
  const handleSaveRole = async () => {
    if (!editingMember) return
    
    setIsSavingRole(true)
    setErrorMessage(null)
    
    try {
      const { error } = await actions.updateMemberRole({
        user_id: editingMember.user_id,
        empresa_id: companyId,
        rol: selectedRole
      })
      
      if (error) {
        setErrorMessage(error.message || "Error al actualizar el rol")
      } else {
        // Update local state
        setMembers(prev => prev.map(m => 
          m.user_id === editingMember.user_id ? { ...m, rol: selectedRole } : m
        ))
        setEditingMember(null)
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Ha ocurrido un error inesperado")
    } finally {
      setIsSavingRole(false)
    }
  }

  // Open Delete Member modal
  const handleDeleteClick = (member: Member) => {
    setDeletingMember(member)
    setErrorMessage(null)
  }

  // Confirm delete member
  const handleConfirmDelete = async () => {
    if (!deletingMember) return
    
    setIsDeleting(true)
    setErrorMessage(null)
    
    try {
      const { error } = await actions.deleteMember({
        user_id: deletingMember.user_id,
        empresa_id: companyId
      })
      
      if (error) {
        setErrorMessage(error.message || "Error al eliminar miembro")
      } else {
        // Update local state
        setMembers(prev => prev.filter(m => m.user_id !== deletingMember.user_id))
        setDeletingMember(null)
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Ha ocurrido un error inesperado")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Grid de miembros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((item) => {
          const profile = Array.isArray(item.profiles)
            ? item.profiles[0]
            : item.profiles
            
          const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim() || "Usuario sin nombre"
          const initials = `${profile?.first_name?.[0] ?? ''}${profile?.last_name?.[0] ?? ''}`.toUpperCase() || "U"
          const avatarColors = getAvatarColors(fullName)
          const isMe = item.user_id === currentUserId

          return (
            <div 
              key={item.user_id} 
              className="relative overflow-hidden rounded-xl border bg-card/60 backdrop-blur-md p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 group hover:-translate-y-0.5"
            >
              {/* Contenedor Flex para Avatar, Datos y Botón Acciones */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <Avatar className={`size-12 border ${avatarColors} transition-transform duration-300 group-hover:scale-105`}>
                    <AvatarFallback className="font-semibold text-sm bg-transparent">{initials}</AvatarFallback>
                  </Avatar>
                  
                  {/* Datos del Miembro */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm leading-none flex items-center gap-1.5">
                        {fullName}
                        {isMe && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium border border-primary/20">
                            Tú
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    {/* Correo */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3.5 shrink-0" />
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {profile?.email || "Sin correo"}
                      </span>
                    </div>
                    
                    {/* Rol Badge */}
                    <div className="pt-1">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${getRoleBadgeStyle(item.rol)}`}>
                        <Shield className="size-3" />
                        {item.rol.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                {isAdminOrOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
                      >
                        <MoreVertical className="size-4" />
                        <span className="sr-only">Acciones</span>
                      </Button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="end" className="w-44 rounded-lg">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {/* Editar Rol */}
                      <DropdownMenuItem 
                        onClick={() => handleEditClick(item)}
                        className="gap-2 text-sm cursor-pointer"
                      >
                        <UserCheck className="size-4" />
                        Editar Rol
                      </DropdownMenuItem>
                      
                      {/* Eliminar Miembro */}
                      {!isMe && item.rol !== 'owner' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(item)}
                            className="gap-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            variant="destructive"
                          >
                            <Trash2 className="size-4" />
                            Eliminar miembro
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Editar Rol */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setEditingMember(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg border border-primary/20">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Editar Rol del Miembro</h3>
                  <p className="text-xs text-muted-foreground">Actualiza los permisos de acceso de este miembro</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 space-y-4">
                <div className="bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
                  <p className="font-semibold text-foreground">
                    Miembro:{" "}
                    <span className="font-normal text-muted-foreground">
                      {Array.isArray(editingMember.profiles)
                        ? `${editingMember.profiles[0]?.first_name} ${editingMember.profiles[0]?.last_name}`
                        : `${editingMember.profiles?.first_name} ${editingMember.profiles?.last_name}`}
                    </span>
                  </p>
                  <p className="font-semibold text-foreground mt-1">
                    Correo:{" "}
                    <span className="font-normal text-muted-foreground">
                      {Array.isArray(editingMember.profiles)
                        ? editingMember.profiles[0]?.email
                        : editingMember.profiles?.email}
                    </span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role-select" className="text-xs font-semibold text-foreground">
                    Selecciona el Rol
                  </label>
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="ayudante">Ayudante (Acceso mínimo)</option>
                    <option value="contador">Contador (Módulos financieros)</option>
                    <option value="admin">Administrador (Gestión casi total)</option>
                    <option value="owner">Dueño/Owner (Acceso y control total)</option>
                  </select>
                </div>
                
                {errorMessage && (
                  <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-xs px-3 py-2 rounded-lg border border-destructive/20">
                    <ShieldAlert className="size-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingMember(null)}
                    disabled={isSavingRole}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveRole}
                    disabled={isSavingRole}
                    className="gap-2"
                  >
                    {isSavingRole && <Loader2 className="size-4 animate-spin" />}
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Eliminación */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDeletingMember(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </button>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/10 text-destructive p-2.5 rounded-lg border border-destructive/20">
                  <Trash2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">¿Eliminar miembro?</h3>
                  <p className="text-xs text-muted-foreground">Esta acción removerá el acceso a la empresa</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ¿Estás seguro de que deseas eliminar a{" "}
                  <strong className="text-foreground">
                    {Array.isArray(deletingMember.profiles)
                      ? `${deletingMember.profiles[0]?.first_name} ${deletingMember.profiles[0]?.last_name}`
                      : `${deletingMember.profiles?.first_name} ${deletingMember.profiles?.last_name}`}
                  </strong>{" "}
                  de la empresa? El usuario perderá el acceso y todos sus roles asociados de forma inmediata.
                </p>
                
                {errorMessage && (
                  <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-xs px-3 py-2 rounded-lg border border-destructive/20">
                    <ShieldAlert className="size-4 shrink-0" />
                    <p>{errorMessage}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setDeletingMember(null)}
                    disabled={isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="gap-2"
                  >
                    {isDeleting && <Loader2 className="size-4 animate-spin" />}
                    Confirmar y Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
