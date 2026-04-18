package com.elitywebstore.repository;

import com.elitywebstore.entities.Address;
import com.elitywebstore.entities.AddressType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("SELECT a FROM Address a WHERE a.userDetails.id = :userDetailsId AND (a.active = true OR a.active IS NULL)")
    List<Address> findActiveByUserDetailsId(@Param("userDetailsId") Long userDetailsId);

    @Query("SELECT a FROM Address a WHERE a.userDetails.id = :userDetailsId")
    List<Address> findAllByUserDetailsId(@Param("userDetailsId") Long userDetailsId);

    @Query("SELECT a FROM Address a WHERE a.userDetails.id = :userDetailsId AND a.addressType = :addressType AND (a.active = true OR a.active IS NULL)")
    List<Address> findActiveByUserDetailsIdAndAddressType(
            @Param("userDetailsId") Long userDetailsId,
            @Param("addressType") AddressType addressType
    );

    @Query("SELECT a FROM Address a WHERE a.userDetails.id = :userDetailsId AND a.addressType = :addressType AND a.isDefault = true AND (a.active = true OR a.active IS NULL)")
    Optional<Address> findDefaultByUserDetailsIdAndAddressType(
            @Param("userDetailsId") Long userDetailsId,
            @Param("addressType") AddressType addressType
    );

    @Query("SELECT a FROM Address a WHERE a.userDetails.id = :userDetailsId AND a.isDefault = true AND (a.active = true OR a.active IS NULL)")
    List<Address> findDefaultsByUserDetailsId(@Param("userDetailsId") Long userDetailsId);
}
