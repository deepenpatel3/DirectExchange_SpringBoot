package edu.sjsu.cmpe275.DirectExchange.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.sjsu.cmpe275.DirectExchange.model.Offer;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

        @Query(value = "Select * from Offer Where user_id = :id and status = 'completed' ", nativeQuery = true)
        Set<Offer> findCompletedOfferOfAUser(@Param("id") long id);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and source_currency = :sourceCurrency", nativeQuery = true)
        Set<Offer> findOfferBySourceCurrency(@Param("id") long id, @Param("sourceCurrency") String sourceCurrency);

//        @Query(value = "Select * from Offer Where user_id = :id and counter_offer_or_not = 0", nativeQuery = true)
        @Query(value = "Select * from Offer Where user_id = :id", nativeQuery = true)
        Set<Offer> findOfferByUserId(@Param("id") long id);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and accepted = 0", nativeQuery = true)
        Set<Offer> findOfferNotSelf(@Param("id") long id);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and remaining_balance = :matchingAmount and source_country = :sourceCountry and destination_country = :destinationCountry", nativeQuery = true)
        List<Offer> findExactMatchingOffer(@Param("id") long id, @Param("matchingAmount") float matchingAmount,
                        @Param("sourceCountry") String sourceCountry,
                        @Param("destinationCountry") String destinationCountry);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and source_country = :sourceCountry and destination_country = :destinationCountry and remaining_balance != :matchingAmount and remaining_balance Between :matchingAmount*0.9 and :matchingAmount*1.1 ", nativeQuery = true)
        List<Offer> findRangeMatchingOffer(@Param("id") long id, @Param("matchingAmount") float matchingAmount,
                        @Param("sourceCountry") String sourceCountry,
                        @Param("destinationCountry") String destinationCountry);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and source_country = :sourceCountry and destination_country = :destinationCountry and remaining_balance != :matchingAmount and remaining_balance < :matchingAmount Order By remaining_balance ASC", nativeQuery = true)
        List<Offer> findSplitMatchingOffer(@Param("id") long id, @Param("matchingAmount") float matchingAmount,
                        @Param("sourceCountry") String sourceCountry,
                        @Param("destinationCountry") String destinationCountry);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and source_country = :sourceCountry and destination_country = :destinationCountry and remaining_balance > :matchingAmount", nativeQuery = true)
        List<Offer> findOppositeMatchingOffer(@Param("id") long id, @Param("matchingAmount") float matchingAmount,
                        @Param("sourceCountry") String sourceCountry,
                        @Param("destinationCountry") String destinationCountry);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and source_country = :sourceCountry and destination_country = :destinationCountry", nativeQuery = true)
        List<Offer> findSameMatchingOffer(@Param("id") long id, @Param("sourceCountry") String sourceCountry,
                        @Param("destinationCountry") String destinationCountry);

        @Query(value = "Select * from offer_matching_offers Where offer_id= :id", nativeQuery = true)
        List<Offer> findOfferOfMatchingOffer(@Param("id") long id);

        @Query(value = "Select * from Offer Where user_id != :id and status = 'open' and counter_offer_or_not = 0 and destination_currency = :destinationCurrency", nativeQuery = true)
        Set<Offer> findOfferByDestinationCurrency(@Param("id") long id,
                        @Param("destinationCurrency") String destinationCurrency);
}
