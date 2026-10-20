package com.placement.system.security;

import com.placement.system.entity.enums.RoleType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    public Long getCurrentUserId() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return principal != null ? principal.getId() : null;
    }

    public boolean isAdmin() {
        UserPrincipal principal = getCurrentUserPrincipal();
        if (principal == null) return false;
        return principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(RoleType.ROLE_ADMIN.name()));
    }

    public void validateUserOwnershipOrAdmin(Long userId) {
        if (isAdmin()) {
            return;
        }
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null || !currentUserId.equals(userId)) {
            throw new AccessDeniedException("Ownership error: You do not have permission to access or modify this user resource.");
        }
    }
}
